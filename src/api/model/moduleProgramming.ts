/**
 * web-backend-swagger
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */

export interface ModuleProgramming { 
    id: number;
    type: ModuleProgramming.TypeEnum;
    name: string;
    description: string;
    autocorrect: boolean;
    maxScore: number;
    state: ModuleProgramming.StateEnum;
    score: number;
    code: string;
    defaultCode: string;
    lastTime?: string;
    lastOrigin?: string;
}
export namespace ModuleProgramming {
    export type TypeEnum = 'general' | 'programming' | 'quiz' | 'sortable' | 'text';
    export const TypeEnum = {
        General: 'general' as TypeEnum,
        Programming: 'programming' as TypeEnum,
        Quiz: 'quiz' as TypeEnum,
        Sortable: 'sortable' as TypeEnum,
        Text: 'text' as TypeEnum
    };
    export type StateEnum = 'correct' | 'incorrect' | 'blank';
    export const StateEnum = {
        Correct: 'correct' as StateEnum,
        Incorrect: 'incorrect' as StateEnum,
        Blank: 'blank' as StateEnum
    };
}