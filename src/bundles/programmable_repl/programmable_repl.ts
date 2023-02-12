/**
 * Source Academy Programmable REPL module
 * @module programmable_repl
 * @author Wang Zihan
 */


import { context } from 'js-slang/moduleHelpers';
import { default_js_slang } from './functions';



/* import AceEditor from 'react-ace';
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-twilight";
import "ace-builds/src-noconflict/ext-language_tools";
import React from 'react';*/
// import { Range, Point } from "ace-builds"
// import * as ace from "ace-builds"



// import { runInContext, IOptions } from 'js-slang';
import { type IOptions } from 'js-slang';
// import { sourceRunner } from 'js-slang/dist/runner/sourceRunner';



export class ProgrammableRepl {
  public evalFunction : Function;
  public userCodeInEditor : String;
  public outputStrings : any[];
  private _editorInstance;
  private _tabReactComponent : any;
  // private _editorInstance : AceEditor;
  // private _editorReactRef : any;
  public customizedEditorProps = {
  	backgroundImageUrl: 'no-background-image',
  	backgroundColorAlpha: 1,
    fontSize: 17,
  };
  constructor() {
    this.evalFunction = (dummy_function_as_placeholder) => {
    	// Small Easter Egg that doesn't affect module functionality and normal user experience :)
    	// Please don't modify these text! Thanks!  :)
    	this.OutputString('[Author (Wang Zihan)] ❤<span style=\'font-weight:bold;\'>I love Keqing and Ganyu.</span>❤', 'pink');
    	this.OutputString('<span style=\'font-style:italic;\'>Showing my love to my favorite girls through a SA module, is that the so-called \"romance of a programmer\"?</span>', 'gray');
    	this.OutputString('❤❤❤❤❤', 'pink');
    	this.OutputString('<br>');
    	this.OutputString('If you see this, please check whether you have called <span style=\'font-weight:bold;font-style:italic;\'>invoke_repl</span> function with the correct parameter before using the Programmable REPL Tab.', 'yellow');
    	// this.OutputString( 'If you see this, please check whether you have called "invoke_repl" function with the correct parameter before using the Programmable REPL tab.', 'yellow' );
    	return 'Easter Egg!';
    };
    this.userCodeInEditor = this.getSavedEditorContent();
    this.outputStrings = [];
    this._editorInstance = null;// To be set when calling "SetEditorInstance" in the ProgrammableRepl Tab React Component render function.
    // this._editorElement = <AceEditor style= { { width: '720px', height: '375px' } } mode='javascript' theme='twilight' onChange={ newValue => this.UpdateUserCode(newValue) } value={this.userCodeInEditor.toString()} />;

    // this._editorReactRef = React.createRef();
    /* this._editorInstance = AceEditor.createEditor(this._editorReactRef.current, {
    	mode='javascript',
    	theme='twilight',
    	onChange= newValue => this.UpdateUserCode(newValue),
    	value=this.userCodeInEditor.toString()
    } );*/
    console.log(this);
  }
  InvokeREPL_Internal(evalFunc : Function) {
    this.evalFunction = evalFunc;
  }
  RunCode() {
  	this.outputStrings = [];
    // alert( this.evalFunction( this.userCodeInEditor ) );
    // alert( this.outputStrings.length );
    let retVal : any;
    try {
      if (this.evalFunction === default_js_slang) {
        retVal = this.evalFunction(this.userCodeInEditor, document.body);
      } else {
        retVal = this.evalFunction(this.userCodeInEditor);
      }
    } catch (exception : any) {
    	// console.log( exception );
    	this.OutputString(`Line ${exception.location.start.line.toString()}: ${exception.error.message}`, 'red');
    	// this.OutputString( 'At line:' + exception.location.start.line + ' column:' + exception.location.start.column );
    	this.reRenderTab();
      return;
    }
    // retVal = this.evalFunction( this.userCodeInEditor );
    if (retVal === undefined) {
    	this.OutputString('Program exit with undefined return value.', 'cyan');
    } else {
      if (typeof (retVal) === 'string') {
    		retVal = `\"${retVal}\"`;
    	}
    	this.OutputString(`Program exit with return value ${retVal}`, 'cyan');
    }
    this.reRenderTab();
    console.log('RunCode finished');
    // this.OutputString( 'Program exited with return value ' + retVal === undefined ? 'undefined' : retVal.toString() );
  }

  UpdateUserCode(code) {
    this.userCodeInEditor = code;
  }

  OutputString(str : String, textColor = 'white') {
  	const checkResult = this.OutputStringSafeCheck(str);
  	if (checkResult != 'safe') {
  		str = `[Warning] Unsafe output string \"${checkResult}\" detacted. Please remove this in the output content and try again.`;
  		textColor = 'red';
  	}
  	let tmp = {
  		content: str,
  		color: textColor,
  	};
  	this.outputStrings.push(tmp);
  }

  // Returns the forbidden word present in the string "str" if it contains at least one unsafe word. Returns "safe" if the string is considered to be safe to output directly into innerHTML.
  private OutputStringSafeCheck(str) {
  	const tmp = str.toLowerCase();
  	let forbiddenWords = ['script', 'javascript', 'eval', 'document', 'window', 'console', 'location'];
  	for (let word of forbiddenWords) {
  		if (tmp.indexOf(word) != -1) {
  			return word;
  		}
  	}
  	return 'safe';
  }

  /* getEditorRef(){
  	return this._editorReactRef;
  }*/

  SetEditorInstance(instance : any) {
  	if (instance === undefined) { return; } // It seems that when calling this function in gui->render->ref, the React internal calls this function for multiple times (at least two times) , and in at least one call the parameter 'instance' is set to 'undefined'. If I don't add this if statement, the program will throw a runtime error when rendering tab.
  	this._editorInstance = instance;
  	this._editorInstance.on('guttermousedown', (e) => {
  		const breakpointLine = e.getDocumentPosition().row;
  		// this._editorInstance.session.setBreakpoint(breakpointLine);
  		/* const point : Point = {
  			row: breakpointLine,
  			column: 1
  		};
  		const range : Range = {
  			start: point,
  			end: point
  		};*/
  		// this._editorInstance.session.addMarker( new ace.Range(breakpointLine,0,breakpointLine,Infinity), 'ace_highlight', 'fullLine', true );
  		console.log(breakpointLine);
  	});

    this._editorInstance.setOptions({ fontSize: `${this.customizedEditorProps.fontSize.toString()}pt` });
    // this.setFontSize(17);
  }


  runInJsSlang(code : string) : string {
    const options : Partial<IOptions> = {
      originalMaxExecTime: 1000,
      scheduler: 'preemptive',
      stepLimit: 1000,
      throwInfiniteLoops: true,
      useSubst: false,
    };
    // let result = sourceRunner( code, context, true, options );
    // let result = (context as {sourceRunner: (code : string, context: Context, verboseErrors: boolean, options: Partial<IOptions>)=>any}).sourceRunner( code, context, true, options );
    /* context.nativeStorage={
      builtins:new Map(),
      previousProgramsIdentifiers:new Set(),
      operators:new Map(),
      gpu:new Map(),
      maxExecTime:1000,
      evaller:null
    };*/
    let jsslangContext = (context as any).backupContext;
    // (context.nativeStorage as any).maxExecTime=1000;
    // (jsslangContext as any).nativeStorage.builtins.set("display",(a)=>console.log(a));
    const prelude = 'const display=(x)=>module_display(x);';
    (context as any).sourceRunner(prelude, jsslangContext, true, options)
      .then((preludeEvalResult) => {
        console.log(preludeEvalResult);
        if (preludeEvalResult.status === 'error') {
          this.OutputString('[Warning] It seems that you havn\'t import the function "module_display" correctly when calling "invoke_repl". The runner will use the default js-slang builtin display function.', 'yellow');
        }
      });
    // (context as any).sourceRunner( prelude, jsslangContext, true, options ).finally();
    let result : Promise<any> = (context as any).sourceRunner(code, jsslangContext, true, options);
    console.log(result);
    // let toReplValue : string = '';
    result.then((evalResult) => {
      if (evalResult.status != 'error') {
        this.OutputString('js-slang program finished with value:', 'cyan');
        this.OutputString(evalResult.value === undefined ? 'undefined' : evalResult.value.toString(), 'cyan');
      } else {
        const errors = jsslangContext.errors;
        const errorCount = errors.length;
        for (let i = 0; i < errorCount; i++) {
          const error = errors[i];
          this.OutputString(`Line ${error.location.start.line}: ${error.type} Error: ${error.explain()}  (${error.elaborate()})`, 'red');
        }
      }
      this.reRenderTab();
    });
    return 'Async run in js-slang';
  }

  setTabReactComponentInstance(tab : any) {
    this._tabReactComponent = tab;
  }

  private reRenderTab() {
    this._tabReactComponent.setState({});// Forces the tab React Component to re-render using setState
  }

  saveEditorContent() {
    localStorage.setItem('programmable_repl_saved_editor_code', this.userCodeInEditor.toString());
    this.OutputString('Saved', 'lightgreen');
    this.OutputString('<span style=\'font-style:italic;\'>The saved code is stored locally in your browser. You may lose the saved code if you clear browser data or use another device.</span>', 'gray');
    this.reRenderTab();
  }

  private getSavedEditorContent() {
    let savedContent = localStorage.getItem('programmable_repl_saved_editor_code');
    if (savedContent === null) { return ''; }
    return savedContent;
  }

  /* setFontSize(fontSizePixel : number){
    console.log( "setFontSize   size=" + fontSizePixel+ "   this._editorInstance=" + this._editorInstance );
    this._editorInstance.setOptions({fontSize : fontSizePixel.toString() + "pt"});
  }*/
}
