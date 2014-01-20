/*global module:false*/

var _ = require('lodash');

module.exports = function (grunt) {

    // Helper methods
    function sub(str) {
        str = str.replace(/%\(name\)/g, LIBRARY_NAME);
        str = str.replace(/%\(version\)/g, LIBRARY_VERSION);
        return str;
    }

    function getLibModules() {
        return _.map(MODULE_LIST, function (module) {
            return LIBRARY_ROOT + module;
        })
    }

    function wrapLibModules(head, tail) {
        return head.concat(getLibModules()).concat(tail);
    }

    var LIBRARY_NAME = 'jsonix',
        LIBRARY_ROOT = 'vendor/jsonix-project-1.2/Jsonix/',
        LIBRARY_VERSION = '1.2';
    
    var MODULE_LIST = [
        'SingleFile.js',
        'Util.js',
        'Class.js',
        'XML.js',
        'DOM.js',
        'Request.js',
        'Schema.js',
        'Model.js',
        'Util/Type.js',
        'Util/NumberUtils.js',
        'Util/StringUtils.js',
        'Util/Ensure.js',
        'XML/QName.js',
        'XML/Calendar.js',
        'XML/Input.js',
        'XML/Output.js',
        'Schema/XSD.js',
        'Schema/XSD/AnyType.js',
        'Schema/XSD/AnySimpleType.js',
        'Schema/XSD/List.js',
        'Schema/XSD/String.js',
        'Schema/XSD/Strings.js',
        'Schema/XSD/NormalizedString.js',
        'Schema/XSD/Token.js',
        'Schema/XSD/Language.js',
        'Schema/XSD/Name.js',
        'Schema/XSD/NCName.js',
        'Schema/XSD/NMToken.js',
        'Schema/XSD/NMTokens.js',
        'Schema/XSD/Boolean.js',
        'Schema/XSD/Base64Binary.js',
        'Schema/XSD/HexBinary.js',
        'Schema/XSD/Number.js',
        'Schema/XSD/Float.js',
        'Schema/XSD/Decimal.js',
        'Schema/XSD/Integer.js',
        'Schema/XSD/NonPositiveInteger.js',
        'Schema/XSD/NegativeInteger.js',
        'Schema/XSD/Long.js',
        'Schema/XSD/Int.js',
        'Schema/XSD/Short.js',
        'Schema/XSD/Byte.js',
        'Schema/XSD/NonNegativeInteger.js',
        'Schema/XSD/UnsignedLong.js',
        'Schema/XSD/UnsignedInt.js',
        'Schema/XSD/UnsignedShort.js',
        'Schema/XSD/UnsignedByte.js',
        'Schema/XSD/PositiveInteger.js',
        'Schema/XSD/Double.js',
        'Schema/XSD/AnyURI.js',
        'Schema/XSD/QName.js',
        'Schema/XSD/Calendar.js',
        'Schema/XSD/Duration.js',
        'Schema/XSD/DateTime.js',
        'Schema/XSD/Time.js',
        'Schema/XSD/Date.js',
        'Schema/XSD/GYearMonth.js',
        'Schema/XSD/GYear.js',
        'Schema/XSD/GMonthDay.js',
        'Schema/XSD/GDay.js',
        'Schema/XSD/GMonth.js',
        'Model/ClassInfo.js',
        'Model/PropertyInfo.js',
        'Model/AnyAttributePropertyInfo.js',
        'Model/SingleTypePropertyInfo.js',
        'Model/AttributePropertyInfo.js',
        'Model/ValuePropertyInfo.js',
        'Model/AbstractElementsPropertyInfo.js',
        'Model/ElementPropertyInfo.js',
        'Model/ElementsPropertyInfo.js',
        'Model/ElementMapPropertyInfo.js',
        'Model/AbstractElementRefsPropertyInfo.js',
        'Model/ElementRefPropertyInfo.js',
        'Model/ElementRefsPropertyInfo.js',
        'Model/AnyElementPropertyInfo.js',
        'Model/Adapter.js',
        'Context.js',
        'Context/Marshaller.js',
        'Context/Unmarshaller.js'
    ];

    var CJS_HEAD = [ 'build/cjs-head.txt' ],
        CJS_TAIL = [ 'build/cjs-tail.txt' ];

    var BANNER = grunt.file.read('./build/jsonix-copyright.txt');

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            all: {
                /*options: {
                    banner: BANNER
                },*/
                src: getLibModules(),
                dest: sub('dist/%(version)/%(name)-all.js')
            },
            cjs: {
                /*options: {
                    banner: BANNER
                },*/
                src: wrapLibModules(CJS_HEAD, CJS_TAIL),
                dest: sub('dist/%(version)/%(name)-all-cjs.js')
            },
            options: {
                banner: BANNER,
                stripBanners: true
            }
        }
    });

    grunt.registerTask('default', [
        'concat:all',
        'concat:cjs'
    ]);
};