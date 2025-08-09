type JSONPrimitiveType = 'number' | 'boolean' | 'string' | 'null';

type JSONNull = { type: 'null' };
type JSONNumber = { type: 'number' };
type JSONBoolean = { type: 'boolean' };
type JSONString = { type: 'string' };
type JSONCompositeType = { type: JSONSchema[] };
type JSONArray = {
  type: 'array';
  items: JSONSchema | JSONSchema[]
};

type JSONObject = {
  type: 'object',
  properties: {
    [k: string]: JSONSchema & { required?: boolean }
  },
  additionalProperties?: boolean | JSONSchema
};

type JSONSchema = JSONNumber | JSONBoolean | JSONString | JSONArray | JSONObject | JSONPrimitiveType | JSONCompositeType;

type OneOf<T extends JSONSchema[]> =
  T extends [infer U, ...infer V]
    ? V extends []
      ? U
      : V extends JSONSchema[]
        ? U | OneOf<V>
        : never
    : never;

type AllOf<T extends JSONSchema[]> =
  T extends [infer U, ...infer V]
    ? V extends []
      ? U
      : V extends JSONSchema[]
        ? U & AllOf<V>
        : never
    : never;

type ArraySchemaToTS<T extends JSONArray> =
  T['items'] extends JSONSchema
    ? SchemaToTS<T['items']>[]
    : T['items'] extends [JSONSchema, ...infer V]
      ? V extends JSONSchema[]
        ? V extends [] ? [SchemaToTS<T['items'][0]>]
          : [SchemaToTS<T['items'][0]>, ...ArraySchemaToTS<{ type: 'array', items: V }>]
        // ? [SchemaToTS<T['items'][0]>]
        : [SchemaToTS<T['items'][0]>]
      : T['items'] extends [JSONSchema]
        ? SchemaToTS<T['items'][0]>[]
        : never;

type ArrayTest = ArraySchemaToTS<{
  type: 'array',
  items: { type: ['string', 'boolean'] }
}>;

type ObjectAdditionalProperties<T extends JSONObject> =
  T['additionalProperties'] extends JSONSchema
    ? {
      [k: string]: SchemaToTS<T['additionalProperties']>
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    : {};

type ObjectSchemaToTS<T extends JSONObject> = {
  [K in keyof T['properties'] as T['properties'][K]['required'] extends true ? K : never]: SchemaToTS<T['properties'][K]>
} & {
  [K in keyof T['properties'] as T['properties'][K]['required'] extends true ? never : K]?: SchemaToTS<T['properties'][K]>
} & ObjectAdditionalProperties<T>;

type ObjectTest = ObjectSchemaToTS<{
  type: 'object'
  properties: {
    a: { type: 'number' }
  }
}>;

type CompositeTypeToTS<T extends JSONCompositeType> =
  T['type'] extends [infer U, ...infer V] ? U extends JSONSchema
    ? V extends JSONSchema[]
      ? SchemaToTS<U> | CompositeTypeToTS<{ type: V }>
      : []
    : never
    : T['type'] extends [infer U]
      ? U extends JSONSchema
        ? SchemaToTS<U>
        : never
      : never;

type CompositeTest = CompositeTypeToTS<{ type: ['number', 'boolean', {
  type: 'object',
  properties: {}
  additionalProperties: { type: 'string' }
}] }>;

type SchemaToTS<T extends JSONSchema> =
  T extends JSONNumber ? number
    : T extends 'number' ? number
      : T extends JSONBoolean ? boolean
        : T extends 'boolean' ? boolean
          : T extends JSONString ? string
            : T extends 'string' ? string
              : T extends JSONNull ? null
                : T extends 'null' ? null
                  : T extends JSONCompositeType ? CompositeTypeToTS<T>
                    : T extends JSONArray ? ArraySchemaToTS<T>
                      : T extends JSONObject ? ObjectSchemaToTS<T>
                        : never;

type Output = SchemaToTS<{
  type: 'object',
  properties: {
    objs: {
      type: 'string'
    }
  },
  additionalProperties: { type: 'number' }
}>;

export function inferSchema<T>(obj: T) {

}
