import { Directive, ElementRef, HostListener, Attribute } from '@angular/core';
import { NgControl, NgModel } from '@angular/forms';

@Directive({
  selector: '[mask]'
})
export class MaskDirective {
  maskPattern: string;
  placeHolderCounts: number;
  dividers: string[];
  modelValue: string;
  viewValue: string;

  constructor(
    private el: ElementRef,
    private control: NgControl,
    public model: NgModel,
    @Attribute("mask") maskPattern: string
  ) {
    this.dividers = maskPattern.replace(/\*/g, "").split("");
    this.dividers.push(" ");
    this.generatePattern(maskPattern);

  }

  @HostListener('input', ['$event']) onEvent($event) {

    if ($event.inputType === 'deleteContentBackward' || $event.inputType === 'deleteContentForward') {

    } else {
      this.modelValue = this.getModelValue(this.el.nativeElement.value);
      this.viewValue = this.format(this.modelValue);
      this.control.control.setValue(this.viewValue);
    }

  }

  generatePattern(patternString) {
    this.placeHolderCounts = (patternString.match(/\*/g) || []).length;
    for (let i = 0; i < this.placeHolderCounts; i++) {
      patternString = patternString.replace('*', "{" + i + "}");
    }
    this.maskPattern = patternString;
  }

  format(s) {
    let formattedString = this.maskPattern;
    for (let i = 0; i < this.placeHolderCounts; i++) {
      formattedString = formattedString.replace("{" + i + "}", s.charAt(i));
    }
    return formattedString;
  }

  getModelValue(modelValue) {
    for (let i = 0; i < this.dividers.length; i++) {
      while (modelValue.indexOf(this.dividers[i]) > -1) {
        modelValue = modelValue.replace(this.dividers[i], "");
      }
    }
    return modelValue;
  }
}
