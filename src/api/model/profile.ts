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

export interface Profile { 
    email: string;
    nickName?: string;
    firstName: string;
    lastName: string;
    gender: string;
    shortInfo: string;
    addrStreet: string;
    addrCity: string;
    addrZip: string;
    addrCountry: string;
    schoolName: string;
    schoolStreet: string;
    schoolCity: string;
    schoolZip: string;
    schoolCountry: string;
    schoolFinish: number;
    tshirtSize: string;
    notifyEval?: boolean;
    notifyResponse?: boolean;
    notifyKsi?: boolean;
    notifyEvents?: boolean;
    id: number;
    author: number;
    resource: string;
}