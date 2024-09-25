/**
 * Copyright 2023-present DreamNum Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { describe, expect, it } from 'vitest';

import { ErrorType } from '../../../../basics/error-type';
import { ArrayValueObject, transformToValueObject } from '../../../../engine/value-object/array-value-object';
import { ErrorValueObject } from '../../../../engine/value-object/base-value-object';
import { BooleanValueObject, NullValueObject, NumberValueObject, StringValueObject } from '../../../../engine/value-object/primitive-object';
import { getObjectValue } from '../../../__tests__/create-function-test-bed';
import { FUNCTION_NAMES_STATISTICAL } from '../../function-names';
import { ExponDist } from '../index';

describe('Test exponDist function', () => {
    const testFunction = new ExponDist(FUNCTION_NAMES_STATISTICAL.EXPON_DIST);

    describe('ExponDist', () => {
        it('Value is normal', () => {
            const x = NumberValueObject.create(0.5);
            const lambda = NumberValueObject.create(1);
            const cumulative = BooleanValueObject.create(true);
            const result = testFunction.calculate(x, lambda, cumulative);
            expect(getObjectValue(result)).toBe(0.3934693402873666);
        });

        it('Lambda value test', () => {
            const x = NumberValueObject.create(0.5);
            const lambda = NumberValueObject.create(0);
            const cumulative = BooleanValueObject.create(true);
            const result = testFunction.calculate(x, lambda, cumulative);
            expect(getObjectValue(result)).toBe(ErrorType.NUM);

            const degFreedom2 = NumberValueObject.create(10 ** 10 + 1);
            const result2 = testFunction.calculate(x, degFreedom2, cumulative);
            expect(getObjectValue(result2)).toBe(1);
        });

        it('Cumulative value test', () => {
            const x = NumberValueObject.create(0.5);
            const lambda = NumberValueObject.create(1);
            const cumulative = BooleanValueObject.create(false);
            const result = testFunction.calculate(x, lambda, cumulative);
            expect(getObjectValue(result)).toBe(0.6065306597126334);
        });

        it('Value is normal string', () => {
            const x = StringValueObject.create('test');
            const lambda = NumberValueObject.create(1);
            const cumulative = BooleanValueObject.create(true);
            const result = testFunction.calculate(x, lambda, cumulative);
            expect(getObjectValue(result)).toBe(ErrorType.VALUE);
        });

        it('Value is boolean', () => {
            const x = BooleanValueObject.create(true);
            const lambda = NumberValueObject.create(1);
            const cumulative = BooleanValueObject.create(true);
            const result = testFunction.calculate(x, lambda, cumulative);
            expect(getObjectValue(result)).toBe(0.6321205588285577);
        });

        it('Value is null', () => {
            const x = NullValueObject.create();
            const lambda = NumberValueObject.create(1);
            const cumulative = BooleanValueObject.create(true);
            const result = testFunction.calculate(x, lambda, cumulative);
            expect(getObjectValue(result)).toBe(0);
        });

        it('Value is error', () => {
            const x = ErrorValueObject.create(ErrorType.NAME);
            const lambda = NumberValueObject.create(1);
            const cumulative = BooleanValueObject.create(true);
            const result = testFunction.calculate(x, lambda, cumulative);
            expect(getObjectValue(result)).toBe(ErrorType.NAME);
        });

        it('Value is array', () => {
            const x = ArrayValueObject.create({
                calculateValueList: transformToValueObject([
                    [1, ' ', 1.23, true, false, null],
                    [0, '100', '2.34', 'test', -3, null],
                ]),
                rowCount: 2,
                columnCount: 6,
                unitId: '',
                sheetId: '',
                row: 0,
                column: 0,
            });
            const lambda = NumberValueObject.create(1);
            const cumulative = BooleanValueObject.create(true);
            const result = testFunction.calculate(x, lambda, cumulative);
            expect(getObjectValue(result)).toStrictEqual([
                [0.6321205588285577, ErrorType.VALUE, 0.7077074223191406, 0.6321205588285577, 0, 0],
                [0, 1, 0.9036723617695069, ErrorType.VALUE, ErrorType.NUM, 0],
            ]);
        });
    });
});