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

Jsonix.Model.Module = Jsonix.Class({
	// name : null,
	// classInfos : null,
	elementInfos : null,
	defaultElementNamespaceURI : '',
	defaultAttributeNamespaceURI : '',
	initialize : function(options) {
		if (Jsonix.Util.Type.isObject(options)) {
			if (Jsonix.Util.Type.isString(options.defaultElementNamespaceURI)) {
				this.defaultElementNamespaceURI = options.defaultElementNamespaceURI;
			}
			if (Jsonix.Util.Type.isString(options.defaultAttributeNamespaceURI)) {
				this.defaultAttributeNamespaceURI = options.defaultAttributeNamespaceURI;
			}
		}
		// Jsonix.Util.Ensure.ensureObject(options);
		// Jsonix.Util.Ensure.ensureString(options.name);
		// this.name = options.name;
		// this.classInfos = [];
		this.elementInfos = [];
	},
	destroy : function() {
	},
	cs : function() {
		return this;
	},
	c : function(options) {
		Jsonix.Util.Ensure.ensureObject(options);
		Jsonix.Util.Ensure.ensureString(options.name);
		if (!Jsonix.Util.Type.isString(options.defaultElementNamespaceURI)) {
			options.defaultElementNamespaceURI = this.defaultElementNamespaceURI;
		}
		if (!Jsonix.Util.Type.isString(options.defaultAttributeNamespaceURI)) {
			options.defaultAttributeNamespaceURI = this.defaultAttributeNamespaceURI;
		}
		this[options.name] = new Jsonix.Model.ClassInfo(options);
		return this;
	},
	es : function() {
		return this;
	},
	e : function(options) {
		Jsonix.Util.Ensure.ensureObject(options);
		Jsonix.Util.Ensure.ensureExists(options.elementName);
		Jsonix.Util.Ensure.ensureExists(options.typeInfo);
		if (Jsonix.Util.Type.isObject(options.elementName)) {
			options.elementName = Jsonix.XML.QName.fromObject(options.elementName);
		} else if (Jsonix.Util.Type.isString(options.elementName)) {
			options.elementName = new Jsonix.XML.QName(this.defaultElementNamespaceURI, options.elementName);
		} else {
			throw 'Element info [' + options + '] must provide an element name.';
		}
		this.elementInfos.push(options);
		return this;
	},
	CLASS_NAME : 'Jsonix.Model.Module'
});