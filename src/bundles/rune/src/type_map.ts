import createTypeMap from '@sourceacademy/modules-lib/type_map';

const typeMapCreator = createTypeMap();

export const { functionDeclaration, variableDeclaration, classDeclaration } = typeMapCreator;

/** @hidden */
export const type_map = typeMapCreator.type_map;
