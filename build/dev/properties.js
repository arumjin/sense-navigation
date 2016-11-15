/*!

* sense-navigation - Sense Sheet Navigation + Actions visualization extension for Qlik Sense.
*
* @version v1.0.0-alpha
* @link https://github.com/stefanwalther/sense-navigation
* @author Stefan Walther
* @license MIT
*/


/*global window,define*/
define( [
	'underscore',
	'qlik',
	'./lib/external/sense-extension-utils/pp-helper',
	'text!./lib/data/icons-fa.json'
], function ( _, qlik, ppHelper, iconListRaw ) {

	// ****************************************************************************************
	// Helper Promises
	// ****************************************************************************************

	/**
	 * Helper method to return a list of icons in a format that can be used by the
	 * dropdown component.
	 *
	 * @returns {Array<value,label>}
	 */
	function getIcons () {
		var iconList = JSON.parse( iconListRaw ).icons;
		var propDef = [];
		propDef.push( {
			"value": "",
			"label": ">> No icon <<"
		} );

		iconList.forEach( function ( icon ) {
			propDef.push(
				{
					"value": icon.id,
					"label": icon.name
				}
			)
		} );
		return _.sortBy( propDef, function ( item ) {
			return item.label;
		} );
	}

	// ****************************************************************************************
	// Layout
	// ****************************************************************************************
	var buttonStyle = {
		type: "string",
		component: "dropdown",
		ref: "props.buttonStyle",
		label: "Style",
		defaultValue: "default",
		options: [
			{
				value: "default",
				label: "Default"
			},
			{
				value: "primary",
				label: "Primary"
			},
			{
				value: "success",
				label: "Success"
			},
			{
				value: "info",
				label: "Info"
			},
			{
				value: "warning",
				label: "Warning"
			},
			{
				value: "danger",
				label: "Danger"
			},
			{
				value: "link",
				label: "Link"
			}
		]

	};

	var buttonWidth = {
		type: "boolean",
		component: "buttongroup",
		label: "Button Width",
		ref: "props.fullWidth",
		options: [
			{
				value: true,
				label: "Full Width",
				tooltip: "Button has the same width as the element."
			},
			{
				value: false,
				label: "Auto Width",
				tooltip: "Auto width depending on the label defined."
			}
		],
		defaultValue: false
	};

	var buttonIcons = {
		type: "string",
		component: "dropdown",
		label: "Icon",
		ref: "props.buttonIcon",
		options: function () {
			return getIcons();
		}
	};

	var buttonTextAlign = {
		ref: "props.buttonTextAlign",
		label: "Label Alignment",
		type: "string",
		component: "dropdown",
		defaultValue: "left",
		options: [
			{
				value: "center",
				label: "Center"
			},
			{
				value: "left",
				label: "Left"
			},
			{
				value: "right",
				label: "Right"
			}
		],
		show: function ( data ) {
			return data.props.fullWidth;
		}
	};

	var buttonAlignment = {
		ref: "props.buttonAlignment",
		type: "string",
		component: "dropdown",
		defaultValue: "top-left",
		options: [
			{
				label: "Top left",
				value: "top-left"
			},
			{
				label: "Top middle",
				value: "top-middle"
			},
			{
				label: "Top right",
				value: "top-right"
			},
			{
				label: "Left middle",
				value: "left-middle"
			},
			{
				label: "Centered",
				value: "centered"
			},
			{
				label: "Right middle",
				value: "right-middle"
			},
			{
				label: "Bottom left",
				value: "bottom-left"
			},
			{
				label: "Bottom middle",
				value: "bottom-middle"
			},
			{
				label: "Bottom right",
				value: "bottom-right"
			}
		]
	};

	var buttonMultiLine = {
		ref: "props.isButtonMultiLine",
		label: "Multiline Label",
		type: "boolean",
		defaultValue: false
	};

	var buttonLabel = {
		ref: "props.buttonLabel",
		label: "Label",
		type: "string",
		expression: "optional",
		show: function () {
			return true;
		},
		defaultValue: "My Button"
	};

	// ****************************************************************************************
	// Navigation Action
	// ****************************************************************************************

	var navigationAction = {
		ref: "props.navigationAction",
		label: "Navigation Action",
		type: "string",
		component: "dropdown",
		default: "nextSheet",
		options: [
			{
				label: "None",
				value: "none"
			},
			{
				label: "Go to next sheet",
				value: "nextSheet"
			},
			{
				label: "Go to previous sheet",
				value: "prevSheet"
			},
			{
				label: "Go to a specific sheet",
				value: "gotoSheet"
			},
			{
				label: "Go to a sheet (defined by Sheet Id)",
				value: "gotoSheetById"
			},
			{
				label: "Go to a story",
				value: "gotoStory"
			},
			{
				label: "Open website",
				value: "openWebsite"
			},
			{
				label: "Switch to Edit Mode",
				value: "switchToEdit"
			}
			// ,
			// {
			// 	label: "Open app",
			// 	value: "openApp"
			// }
		]
	};

	var sheetId = {
		ref: "props.sheetId",
		label: "Sheet ID",
		type: "string",
		expression: "optional",
		show: function ( data ) {
			return data.props.navigationAction === 'gotoSheetById';
		}
	};

	var appList = {
		type: "string",
		component: "dropdown",
		label: "Select App",
		ref: "props.selectedApp",
		options: ppHelper.getAppList(),
		show: function ( data ) {
			return data.props.navigationAction === 'openApp';
		}
	};

	var sheetList = {
		type: "string",
		component: "dropdown",
		label: "Select Sheet",
		ref: "props.selectedSheet",
		options: ppHelper.getSheetList(),
		show: function ( data ) {
			return data.props.navigationAction === 'gotoSheet';
		}
	};

	var storyList = {
		type: "string",
		component: "dropdown",
		label: "Select Story",
		ref: "props.selectedStory",
		options: ppHelper.getStoryList(),
		show: function ( data ) {
			return data.props.navigationAction === 'gotoStory'
		}
	};

	var websiteUrl = {
		ref: "props.websiteUrl",
		label: "Website Url:",
		type: "string",
		expression: "optional",
		show: function ( data ) {
			return data.props.navigationAction === 'openWebsite';
		}

	};

	// ****************************************************************************************
	// Action-Group
	// ****************************************************************************************

	var actionOptions = [
		{
			value: "applyBookmark",
			label: "Apply Bookmark",
			group: "bookmark"
		},
		{
			value: "clearAll",
			label: "Clear All Selections",
			group: "selection"
		},
		{
			value: "clearOther",
			label: "Clear Other Fields",
			group: "selection"
		},
		{
			value: "forward",
			label: "Forward (in your Selections)",
			group: "selection"
		},
		{
			value: "back",
			label: "Back (in your Selections)",
			group: "selection"
		},
		{
			value: "clearField",
			label: "Clear Selection in Field",
			group: "selection"
		},
		{
			value: "lockAll",
			label: "Lock All",
			group: "selection"
		},
		{
			value: "lockField",
			label: "Lock Field",
			group: "selection"
		},
		{
			value: "selectAll",
			label: "Select All Values in Field",
			group: "selection"
		},
		{
			value: "selectAlternative",
			label: "Select Alternatives",
			group: "selection"
		},
		{
			value: "selectAndLockField",
			label: "Select and Lock in Field",
			group: "selection"
		},
		{
			value: "selectExcluded",
			label: "Select Excluded",
			group: "selection"
		},
		{
			value: "selectField",
			label: "Select Value in Field",
			group: "selection"
		},
		{
			value: "selectPossible",
			label: "Select Possible Values in Field",
			group: "selection"
		},
		{
			value: "selectValues",
			label: "Select Multiple Values in Field",
			group: "selection"
		},
		{
			value: "setVariable",
			label: "Set Variable Value",
			group: "variables"
		},
		{
			value: "toggleSelect",
			label: "Toggle Field Selection",
			group: "selection"
		},
		{
			value: "unlockAll",
			label: "Unlock All",
			group: "selection"
		},
		{
			value: "unlockField",
			label: "Unlock Field",
			group: "selection"
		},
		{
			value: "unlockAllAndClearAll",
			label: "Unlock All and Clear All Fields",
			group: "selection"
		}
	];

	// ****************************************************************************************
	// n-actions
	// ****************************************************************************************
	var bookmarkEnabler = ['applyBookmark'];
	var fieldEnabler = ['clearField', 'clearOther', 'lockField', 'selectAll', 'selectAlternative', 'selectExcluded', 'selectField', 'selectPossible', 'selectValues', 'selectAndLockField', 'toggleSelect', 'unlockField'];
	var valueEnabler = ['selectField', 'selectValues', 'setVariable', 'selectAndLockField', 'toggleSelect'];
	var valueDescEnabler = ['selectValues'];
	var variableEnabler = ['setVariable'];
	var overwriteLockedEnabler = ['clearOther', 'selectAll', 'selectAlternative', 'selectExcluded', 'selectPossible', 'toggleSelect'];

	var actionGroup = {
		ref: "actionGroup",
		label: "Selection Action Type",
		type: "string",
		component: "dropdown",
		defaultValue: "selection",
		options: [
			{
				label: "Selection",
				value: "selection"
			},
			{
				label: "Bookmark",
				value: "bookmark"
			},
			{
				label: "Variables",
				value: "variables"
			}
		]
	};

	var actions = {
		type: "array",
		ref: "props.actionItems",
		label: "Actions",
		itemTitleRef: function ( data ) {
			var v = _.where( actionOptions, {value: data.actionType} );
			return (v && v.length > 0) ? v[0].label : data.actionType;
		},
		allowAdd: true,
		allowRemove: true,
		addTranslation: "Add Item",
		grouped: true,
		items: {
			//actionGroup: actionGroup,
			actionType: {
				type: "string",
				ref: "actionType",
				component: "dropdown",
				defaultValue: "none",
				options: actionOptions
			},
			bookmarkList: {
				type: "string",
				ref: "selectedBookmark",
				component: "dropdown",
				label: "Select bookmark",
				expression: "optional",
				options: ppHelper.getBookmarkList(),
				show: function ( data, defs ) {
					var def = _.findWhere( defs.layout.props.actionItems, {cId: data.cId} );
					return def && bookmarkEnabler.indexOf( def.actionType ) > -1;
				}
			},
			fieldList: {
				type: "string",
				ref: "selectedField",
				component: "dropdown",
				label: "Select field",
				defaultValue: "",
				options: function () {
					return ppHelper.getFieldList().then( function ( fieldList ) {
						fieldList.splice( 0, 0, {
							value: "by-expr",
							label: ">> Define field by expression <<"
						} );
						return fieldList;
					} )
				},
				show: function ( data, defs ) {
					var def = _.findWhere( defs.layout.props.actionItems, {cId: data.cId} );
					return def && fieldEnabler.indexOf( def.actionType ) > -1;
				}
			},
			field: {
				type: "string",
				ref: "field",
				label: "Field",
				expression: "optional",
				show: function ( data, defs ) {
					var def = _.findWhere( defs.layout.props.actionItems, {cId: data.cId} );
					return def && fieldEnabler.indexOf( def.actionType ) > -1 && def.selectedField === 'by-expr';
				}
			},
			value: {
				type: "string",
				ref: "value",
				label: "Value",
				expression: "optional",
				show: function ( data, defs ) {
					var def = _.findWhere( defs.layout.props.actionItems, {cId: data.cId} );
					return def && valueEnabler.indexOf( def.actionType ) > -1;
				}
			},
			valueDesc: {
				type: "text",
				component: "text",
				ref: "valueDesc",
				label: "Define multiple values separated with a semi-colon (;).",
				show: function ( data, defs ) {
					var def = _.findWhere( defs.layout.props.actionItems, {cId: data.cId} );
					return def && valueDescEnabler.indexOf( def.actionType ) > -1;
				}
			},
			variable: {
				type: "string",
				ref: "variable",
				label: "Variable Name",
				expression: "optional",
				show: function ( data, defs ) {
					var def = _.findWhere( defs.layout.props.actionItems, {cId: data.cId} );
					return def && variableEnabler.indexOf( def.actionType ) > -1;
				}
			},
			overwriteLocked: {
				type: "boolean",
				ref: "softLock",
				label: "Overwrite locked selections",
				defaultValue: false,
				show: function ( data, defs ) {
					var def = _.findWhere( defs.layout.props.actionItems, {cId: data.cId} );
					return def && overwriteLockedEnabler.indexOf( def.actionType ) > -1;
				}
			}

		}
	};

	// ****************************************************************************************
	// Setup
	// ****************************************************************************************
	var settings = {
		uses: "settings",
		items: {
			general: {
				items: {
					showTitles: {
						defaultValue: false
					}
				}
			},
			layout: {
				type: "items",
				label: "Layout",
				items: {
					label: buttonLabel,
					style: buttonStyle,
					buttonWidth: buttonWidth,
					buttonAlignment: buttonAlignment,
					buttonTextAlign: buttonTextAlign,
					buttonMultiLine: buttonMultiLine,
					buttonIcons: buttonIcons
				}
			},
			actionsList: actions,
			behavior: {
				type: "items",
				label: "Navigation Behavior",
				items: {
					action: navigationAction,
					sheetId: sheetId,
					sheetList: sheetList,
					storyList: storyList,
					websiteUrl: websiteUrl,
					appList: appList
				}
			}
		}
	};

	var panelDefinition = {
		type: "items",
		component: "accordion",
		items: {
			settings: settings
		}
	};

	// ****************************************************************************************
	// Return Values
	// ****************************************************************************************
	return panelDefinition;

} );
