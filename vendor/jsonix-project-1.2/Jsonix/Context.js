/*
 * Jsonix is a JavaScript library which allows you to convert between XML
 * and JavaScript object structures.
 *
 * Copyright (c) 2010, Aleksei Valikov, Highsource.org
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the Aleksei Valikov nor the
 *       names of contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL ALEKSEI VALIKOV BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

Jsonix.Context = Jsonix.Class({
	elementInfos : null,
	properties : null,
	substitutionMembersMap : null,
	scopedElementInfosMap : null,
	initialize : function(schemas, properties) {

		this.elementInfos = [];
		this.properties = {
			namespacePrefixes : {}
		};
		Jsonix.Util.Ensure.ensureArray(schemas);
		for ( var index = 0; index < schemas.length; index++) {
			var schema = schemas[index];
			Jsonix.Util.Ensure.ensureArray(schema.elementInfos);
			for ( var kndex = 0; kndex < schema.elementInfos.length; kndex++) {
				
				var kElementInfo = schema.elementInfos[kndex];
				this.elementInfos.push(kElementInfo);
				if (Jsonix.Util.Type.exists(kElementInfo.substitutionHead)) {
					if (Jsonix.Util.Type.isObject(kElementInfo.substitutionHead)) {
						kElementInfo.substitutionHead = Jsonix.XML.QName.fromObject(kElementInfo.substitutionHead);
					} else {
						Jsonix.Util.Ensure.ensureString(kElementInfo.substitutionHead);
						kElementInfo.substitutionHead = new Jsonix.XML.QName(schema.defaultElementNamespaceURI, kElementInfo.substitutionHead);
					}
				}
			}
		}

		if (Jsonix.Util.Type.isObject(properties)) {
			if (Jsonix.Util.Type.isObject(properties.namespacePrefixes)) {
				this.properties.namespacePrefixes = properties.namespacePrefixes;
			}
		}

		this.substitutionMembersMap = {};
		this.scopedElementInfosMap = {};

		for ( var jndex = 0; jndex < this.elementInfos.length; jndex++) {
			var elementInfo = this.elementInfos[jndex];

			if (Jsonix.Util.Type.exists(elementInfo.substitutionHead)) {
				var substitutionHead = elementInfo.substitutionHead;
				var substitutionHeadKey = substitutionHead.key;
				var substitutionMembers = this.substitutionMembersMap[substitutionHeadKey];

				if (!Jsonix.Util.Type.isArray(substitutionMembers)) {
					substitutionMembers = [];
					this.substitutionMembersMap[substitutionHeadKey] = substitutionMembers;
				}
				substitutionMembers.push(elementInfo);
			}

			var scopeKey;
			if (Jsonix.Util.Type.exists(elementInfo.scope)) {
				scopeKey = elementInfo.scope.name;
			} else {
				scopeKey = '##global';
			}

			var scopedElementInfos = this.scopedElementInfosMap[scopeKey];

			if (!Jsonix.Util.Type.isObject(scopedElementInfos)) {
				scopedElementInfos = {};
				this.scopedElementInfosMap[scopeKey] = scopedElementInfos;
			}
			scopedElementInfos[elementInfo.elementName.key] = elementInfo;
		}
	},
	getElementInfo : function(name, scope) {
		if (Jsonix.Util.Type.exists(scope)) {
			var scopeKey = scope.name;
			var scopedElementInfos = this.scopedElementInfosMap[scopeKey];
			if (Jsonix.Util.Type.exists(scopedElementInfos)) {
				var scopedElementInfo = scopedElementInfos[name.key];
				if (Jsonix.Util.Type.exists(scopedElementInfo)) {
					return scopedElementInfo;
				}
			}
		}

		var globalScopeKey = '##global';
		var globalScopedElementInfos = this.scopedElementInfosMap[globalScopeKey];
		if (Jsonix.Util.Type.exists(globalScopedElementInfos)) {
			var globalScopedElementInfo = globalScopedElementInfos[name.key];
			if (Jsonix.Util.Type.exists(globalScopedElementInfo)) {
				return globalScopedElementInfo;
			}
		}
		return null;
		//
		// throw "Element [" + name.key
		// + "] could not be found in the given context.";
	},
	getSubstitutionMembers : function(name) {
		return this.substitutionMembersMap[Jsonix.XML.QName.fromObject(name).key];
	},
	createMarshaller : function() {
		return new Jsonix.Context.Marshaller(this);
	},
	createUnmarshaller : function() {
		return new Jsonix.Context.Unmarshaller(this);
	},
	CLASS_NAME : 'Jsonix.Context'
});