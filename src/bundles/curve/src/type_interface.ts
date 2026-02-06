/* eslint-disable @typescript-eslint/no-unused-vars */
import createTypeMap from '@sourceacademy/modules-lib/type_map';

const typeMapCreator = createTypeMap();
export const { classDeclaration, functionDeclaration, typeDeclaration } = typeMapCreator;

@classDeclaration('Point')
class Point { }

@classDeclaration('AnimatedCurve')
class AnimatedCurve { }

@typeDeclaration('(u: number) => Point')
class Curve { }

@typeDeclaration('(t: number) => Curve')
class CurveAnimation { }

/** @hidden */
export const type_map = typeMapCreator.type_map;
