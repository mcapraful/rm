import { Injectable } from '@angular/core';
import * as Combinatorics from 'js-combinatorics';

@Injectable({
    providedIn: 'root',
})
export class UserBidLogicHelperService {
    constructor() { }

    createJodiDigitsArray(start: number, limit: number): any[] {
        const jodiDigitsArray = [];
        for (let i = start; i < limit; i++) {

            (i < 10) ? jodiDigitsArray.push({ index: i, value: i, uiValue: `0${i.toString()}` }) :
                jodiDigitsArray.push({ index: i, value: i, uiValue: i.toString() });
        }
        return jodiDigitsArray;
    }

    sortArray(array, propertyName): any[] {
        // tslint:disable-next-line:no-string-literal
        return array.sort((a, b) => parseFloat(a[propertyName]) - parseFloat(b[propertyName]));
    }

    spMotorDigitsArray(inputNumber: string | number, size: number): any[] {
        let combinationsArray: any = [];
        combinationsArray = new Combinatorics.Combination(inputNumber.toString(), size);
        combinationsArray = [...combinationsArray].map((item, index) => {
            return {
                index,
                uiValue: item.join(''),
                value: item.join('') ? parseInt(item.join(''), 0) : null
            };
        });

        return combinationsArray;
    }

    dpMotorDigitsArray(inputNumber: string | number, size: number): any[] {
        let combinationsArray: any = [];
        combinationsArray = new Combinatorics.BaseN(inputNumber.toString(), size);
        console.log(' dpMotorDigitsArray combinationsArray', combinationsArray);

        combinationsArray = [...combinationsArray].map((item, index) => {
            return {
                index,
                uiValue: item.join(''),
                value: item.join('') ? parseInt(item.join(''), 0) : null
            };
        });

        return combinationsArray;
    }

    isAscending(numberInString): boolean {
        const arr = numberInString.split('');
        return arr.every((x, i) => {
            return i === 0 || x >= arr[i - 1];
        });
    }

    isDescending(numberInString): boolean {
        const arr = numberInString.split('');
        return arr.every((x, i) => {
            return i === 0 || x <= arr[i - 1];
        });
    }
}
