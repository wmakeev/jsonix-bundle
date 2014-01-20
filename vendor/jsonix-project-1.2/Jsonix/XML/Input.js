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

Jsonix.XML.Input = Jsonix.Class({
	root : null,
	node : null,
	eventType : null,
	initialize : function(node) {
		Jsonix.Util.Ensure.ensureExists(node);
		this.root = node;
	},
	hasNext : function() {
		// No current node, we've not started yet
		if (this.node === null) {
			return true;
		} else if (this.node === this.root) {
			// Root node is document, last event type is END_DOCUMENT
			if (this.node.nodeType === 9 && this.eventType === 8) {
				return false;
			}
			// Root node is element, last event type is END_ELEMENT
			else if (this.node.nodeType === 1 && this.eventType === 2) {
				return false;
			} else {
				return true;
			}
		} else {
			return true;
		}
	},
	next : function() {
		if (this.eventType === null) {
			return this.enter(this.root);
		}
		// START_DOCUMENT
		if (this.eventType === 7) {
			if (Jsonix.Util.Type.exists(this.node.documentElement)) {
				return this.enter(this.node.documentElement);
			} else {
				return this.leave(this.node);
			}
		} else if (this.eventType === 1) {
			if (Jsonix.Util.Type.exists(this.node.firstChild)) {
				return this.enter(this.node.firstChild);
			} else {
				return this.leave(this.node);
			}
		} else if (this.eventType === 2) {
			if (Jsonix.Util.Type.exists(this.node.nextSibling)) {
				return this.enter(this.node.nextSibling);
			} else {
				return this.leave(this.node);
			}
		} else {
			return this.leave(this.node);
		}
	},
	enter : function(node) {
		var nodeType = node.nodeType;
		// Document node
		if (nodeType === 1) {
			this.node = node;
			// START_ELEMENT
			this.eventType = 1;
			return this.eventType;
		} else if (nodeType === 2) {
			this.node = node;
			// ATTRIBUTE
			this.eventType = 10;
			return this.eventType;
		} else if (nodeType === 3) {
			this.node = node;
			var nodeValue = node.nodeValue;
			if (Jsonix.Util.StringUtils.isEmpty(nodeValue)) {
				// SPACE
				this.eventType = 6;
			} else {
				// CHARACTERS
				this.eventType = 4;
			}
			return this.eventType;
		} else if (nodeType === 4) {
			this.node = node;
			// CDATA
			this.eventType = 12;
			return this.eventType;
		} else if (nodeType === 5) {
			// ENTITY_REFERENCE_NODE = 5
			this.node = node;
			// ENTITY_REFERENCE
			this.eventType = 9;
			return this.eventType;
		} else if (nodeType === 6) {
			this.node = node;
			// ENTITY_DECLARATION
			this.eventType = 15;
			return this.eventType;
		} else if (nodeType === 7) {
			this.node = node;
			// PROCESSING_INSTRUCTION
			this.eventType = 3;
			return this.eventType;
		} else if (nodeType === 8) {
			this.node = node;
			// COMMENT
			this.eventType = 5;
			return this.eventType;
		} else if (nodeType === 9) {
			this.node = node;
			// START_DOCUMENT
			this.eventType = 7;
			return this.eventType;
		} else if (nodeType === 10) {
			this.node = node;
			// DTD
			this.eventType = 12;
			return this.eventType;
		} else if (nodeType === 12) {
			this.node = node;
			// NOTATION_DECLARATION
			this.eventType = 14;
			return this.eventType;
		} else {
			// DOCUMENT_FRAGMENT_NODE = 11
			throw "Node type [" + nodeType + '] is not supported.';
		}
	},
	leave : function(node) {
		if (node.nodeType === 9) {
			if (this.eventType == 8) {
				throw "Invalid state.";
			} else {
				this.node = node;
				// END_ELEMENT
				this.eventType = 8;
				return this.eventType;
			}
		} else if (node.nodeType === 1) {
			if (this.eventType == 2) {
				if (Jsonix.Util.Type.exists(node.nextSibling)) {
					return this.enter(node.nextSibling);
				}
			} else {
				this.node = node;
				// END_ELEMENT
				this.eventType = 2;
				return this.eventType;
			}
		}

		if (Jsonix.Util.Type.exists(node.nextSibling)) {
			return this.enter(node.nextSibling);
		} else {
			var parentNode = node.parentNode;
			this.node = parentNode;
			if (parentNode.nodeType === 9) {
				this.eventType = 8;
			} else {
				this.eventType = 2;
			}
			return this.eventType;
		}
	},
	getName : function() {
		var node = this.node;
		if (Jsonix.Util.Type.isString(node.nodeName)) {
			if (Jsonix.Util.Type.isString(node.namespaceURI)) {
				return new Jsonix.XML.QName(node.namespaceURI, node.nodeName);
			} else {
				return new Jsonix.XML.QName(node.nodeName);
			}
		} else {
			return null;
		}
	},
	getText : function() {
		return this.node.nodeValue;
	},
	nextTag : function() {
		var et = this.next();
		// TODO isWhiteSpace
		while (et === 7 || et === 4 || et === 12 || et === 6 || et === 3 || et === 5) {
			et = this.next();
		}
		if (et !== 1 && et !== 2) {
			// TODO location
			throw 'Expected start or end tag.';
		}
		return et;

	},
	getElementText : function() {
		if (this.eventType != 1) {
			throw "Parser must be on START_ELEMENT to read next text.";
		}
		var et = this.next();
		var content = '';
		while (et !== 2) {
			if (et === 4 || et === 12 || et === 6 || et === 9) {
				content = content + this.getText();
			} else if (et === 3 || et === 5) {
				// Skip PI or comment
			} else if (et === 8) {
				// End document
				throw "Unexpected end of document when reading element text content.";
			} else if (et === 1) {
				// End element
				// TODO location
				throw "Element text content may not contain START_ELEMENT.";
			} else {
				// TODO location
				throw ("Unexpected event type [" + et + "].");
			}
			et = this.next();
		}
		return content;
	},
	getAttributeCount : function() {
		var attributes;
		if (this.eventType === 1) {
			attributes = this.node.attributes;
		} else if (this.eventType === 10) {
			attributes = this.node.parentNode.attributes;
		} else {
			throw "Number of attributes can only be retrieved for START_ELEMENT or ATTRIBUTE.";
		}
		return attributes.length;
	},
	getAttributeName : function(index) {
		var attributes;
		if (this.eventType === 1) {
			attributes = this.node.attributes;
		} else if (this.eventType === 10) {
			attributes = this.node.parentNode.attributes;
		} else {
			throw "Number of attributes can only be retrieved for START_ELEMENT or ATTRIBUTE.";
		}
		if (index < 0 || index >= attributes.length) {
			throw "Invalid attribute index [" + index + "].";
		}
		var attribute = attributes[index];
		
		
		if (Jsonix.Util.Type.isString(attribute.namespaceURI)) {
			return new Jsonix.XML.QName(attribute.namespaceURI, attribute.nodeName);
		} else {
			return new Jsonix.XML.QName(attribute.nodeName);
		}
	},
	getAttributeValue : function(index) {
		var attributes;
		if (this.eventType === 1) {
			attributes = this.node.attributes;
		} else if (this.eventType === 10) {
			attributes = this.node.parentNode.attributes;
		} else {
			throw "Number of attributes can only be retrieved for START_ELEMENT or ATTRIBUTE.";
		}
		if (index < 0 || index >= attributes.length) {
			throw "Invalid attribute index [" + index + "].";
		}
		var attribute = attributes[index];
		return attribute.nodeValue;
	},
	getElement : function() {
		if (this.eventType === 1 || this.eventType === 2) {
			// Go to the END_ELEMENT
			this.eventType = 2;
			return this.node;
		} else {
			throw "Parser must be on START_ELEMENT or END_ELEMENT to return current element.";
		}
	},
	CLASS_NAME : "Jsonix.XML.Input"

});

Jsonix.XML.Input.START_ELEMENT = 1;
Jsonix.XML.Input.END_ELEMENT = 2;
Jsonix.XML.Input.PROCESSING_INSTRUCTION = 3;
Jsonix.XML.Input.CHARACTERS = 4;
Jsonix.XML.Input.COMMENT = 5;
Jsonix.XML.Input.SPACE = 6;
Jsonix.XML.Input.START_DOCUMENT = 7;
Jsonix.XML.Input.END_DOCUMENT = 8;
Jsonix.XML.Input.ENTITY_REFERENCE = 9;
Jsonix.XML.Input.ATTRIBUTE = 10;
Jsonix.XML.Input.DTD = 11;
Jsonix.XML.Input.CDATA = 12;
Jsonix.XML.Input.NAMESPACE = 13;
Jsonix.XML.Input.NOTATION_DECLARATION = 14;
Jsonix.XML.Input.ENTITY_DECLARATION = 15;