import { Component, Input, ViewEncapsulation, AfterViewInit, OnChanges } from '@angular/core';
import Keyboard from "simple-keyboard";

@Component({
  selector: 'app-simple-keyboard',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './simple-keyboard.component.html',
  styleUrls: ['../../../../node_modules/simple-keyboard/build/css/index.css'],
})
export class SimpleKeyboardComponent implements AfterViewInit, OnChanges {

  @Input() inputs: any;
  @Input() inputName: any;
  @Input() inputFocus: any;
  @Input() inputChange: any;

  inputFocusControl: any;
  inputChangeControl: any;
  keyboardInner!: Keyboard;

  ngAfterViewInit() {
    this.keyboardInner = new Keyboard({
      debug: true,
      inputName: this.inputName,
      onChange: (input) => this.onChange(input),
      onKeyPress: (button) => this.onKeyPress(button),
      preventMouseDownDefault: true // If you want to keep focus on input
    });

    /**
     * Since we have default values for our inputs,
     * we must sync them with simple-keyboard
     */
    this.keyboardInner.replaceInput(this.inputs);
  }

  ngOnChanges() {
    if (this.inputFocus !== this.inputFocusControl) {
      this.onInputFocus(this.inputFocus);
      this.inputFocusControl = this.inputFocus;
    }
    if (this.inputChange !== this.inputChangeControl) {
      this.onInputChange(this.inputChange);
      this.inputChangeControl = this.inputChange;
    }
  }

  onInputFocus = (event: any) => {
    this.inputName = event.target.id;
    this.keyboardInner.setOptions({
      inputName: event.target.id
    });
  };

  setInputCaretPosition = (elem: any, pos: number) => {
    if (elem.setSelectionRange) {
      elem.focus();
      elem.setSelectionRange(pos, pos);
    }
  };

  onInputChange = (event: any) => {
    this.keyboardInner.setInput(event.target.value, event.target.id);
  };

  onChange = (input: string) => {
    this.inputs[this.inputName] = input;

    /**
     * Synchronizing input caret position
     * This part is optional and only relevant if using the option "preventMouseDownDefault: true"
     */
    let caretPosition = this.keyboardInner.caretPosition;

    if (caretPosition !== null)
      this.setInputCaretPosition(
        document.querySelector(`#${this.inputName}`),
        caretPosition
      );
  };

  onKeyPress = (button: string) => {
    /**
     * If you want to handle the shift and caps lock buttons
     */
    if (button === "{shift}" || button === "{lock}") this.handleShift();
  };

  handleShift = () => {
    let currentLayout = this.keyboardInner.options.layoutName;
    let shiftToggle = currentLayout === "default" ? "shift" : "default";

    this.keyboardInner.setOptions({
      layoutName: shiftToggle
    });
  };
}
