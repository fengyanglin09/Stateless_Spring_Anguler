import {FilterMetadata} from 'primeng/api';


export type Filter = FilterMetadata | FilterMetadata[] | undefined;

export type FilterMap = {
  [key: string]: Filter
};

export class TableFilter {
  column?: { [s: string]: FilterMetadata | FilterMetadata[] } = {};
  nonColumn?: { [s: string]: FilterMetadata | FilterMetadata[] } = {};
}

export class FilterDefinition {
  type?: string; // string, number
  field?: string;
  operations?: FilterOperation[] = [];
  replacements?: FilterReplacement[];
  exists?: boolean;
}

export class FilterOperation {
  type?: string; // exists
  path?: string;
  conditions?: string[];
}

export class FilterReplacement {
  value: any;
  replace: any;
  mode?: string;
}


export class FilterUtils {


  static createFilterMetadataKey(field: string, type: string = "string", operations: string = "[]"): string {
    return `{"type":"${type}","field":"${field}","operations":${operations}}`;
  }

  public static isFilterMetadata(filter: any) {
    return typeof filter === 'object' && !this.isFilterMetadataArray(filter) && !this.isFilterString(filter);
  }

  public static isFilterMetadataArray(filter: any) {
    return filter instanceof Array;
  }

  public static isFilterString(filter: any) {
    return typeof filter === 'string';
  }

  public static createBooleanFilter(field: string): FilterDefinition {
    return {
      type: 'boolean',
      field: field
    };
  }

  public static createBooleanReplaceFilter(field: string, replacements?: FilterReplacement[]): FilterDefinition {
    return {
      type: 'boolean',
      field: field,
      replacements: replacements ? replacements : undefined
    };
  }

  public static createBooleanExistsFilter(field: string): FilterDefinition {
    return {
      type: 'boolean',
      field: field,
      exists: true
    };
  }

  public static createStringFilter(field: string, operations: FilterOperation[] = []): FilterDefinition {
    return {
      type: 'string',
      field: field,
      operations: operations ? operations : []
    };
  }

  public static createNumberFilter(field: string, operations: FilterOperation[] = []): FilterDefinition {
    return {
      type: 'number',
      field: field,
      operations: operations ? operations : []
    };
  }

  public static createDateFilter(field: string, operations: FilterOperation[] = []): FilterDefinition {
    return {
      type: 'date',
      field: field,
      operations: operations ? operations : []
    };
  }

  public static createExistsOperation(path: string, conditions: string[]): FilterOperation {
    return {
      type: 'exists',
      path: path,
      conditions: conditions
    };
  }

  public static stringifyMap(filters: FilterMap): string[] {
    const result: string[] = [];
    for (let field in filters) {
      if (filters[field]) {
        if (this.isFilterString(filters[field])) {
          result.push(filters[field] as string);
        } else if (this.isFilterMetadataArray(filters[field])) {
          let filterMetadata: FilterMetadata[] = filters[field] as FilterMetadata[];
          if (filterMetadata.length > 0) {
            const condition = this.stringifyFilterConditions(field, filterMetadata);
            if (condition)
              result.push(condition);
          }
        } else if (this.isFilterMetadata(filters[field])) {
          const condition = this.stringifyFilterConditions(field, [filters[field] as FilterMetadata]);
          if (condition)
            result.push(condition);
        }
      }
    }
    return result;
  }

  private static stringifyFilterConditions(field: string, filterMetadata: FilterMetadata[]): string | null {
    const conditions = filterMetadata
      .map(filterMetadata => {
        filterMetadata.value = this.convertEmptyStringstoNull(filterMetadata.value);
        return filterMetadata;
      } )
      .filter(filterMetadata => filterMetadata.value != null && filterMetadata.matchMode != null)
      .map(filterMetadata => this.stringifyFilterCondition(field, filterMetadata))
      .filter(filter => filter != null && filter.length > 0);
    if (conditions.length > 1) {
      const separator = `) ${filterMetadata[0].operator} (`;
      return `(${conditions.join(separator)})`;
    } else if (conditions.length === 1) {
      return conditions[0];
    }
    return null;
  }

  private static convertEmptyStringstoNull(filterValue: any) {
    if (filterValue !== null && filterValue !== undefined) {
      if ((typeof filterValue === 'string' && filterValue.trim().length == 0) || (Array.isArray(filterValue) && filterValue.length == 0)) return null;
      else return filterValue;
    }
    return filterValue!==undefined? filterValue:null;
  }


  private static stringifyFilterCondition(field: string, filterMetadata: FilterMetadata): string | null {
    if (field && filterMetadata) {
      if (field.startsWith('{')) {
        const filterDefinition: FilterDefinition = JSON.parse(field);
        if (filterDefinition) {
          let expression: string | null = null;
          if (filterDefinition.type === "boolean") {
            if (filterDefinition.exists) {
              expression = this.stringifyFilterBooleanExists(filterDefinition, filterMetadata);
            } else if (filterDefinition.replacements) {
              expression = this.stringifyFilterBooleanReplace(filterDefinition, filterMetadata);
            } else if (filterDefinition?.field) {
              expression = this.stringifyFilterExpression(filterDefinition.field, filterDefinition.type, filterMetadata);
            }
          } else if (filterDefinition.field) {
            expression = this.stringifyFilterExpression(filterDefinition.field, filterDefinition.type || null, filterMetadata);
            if (expression) {
              if (filterDefinition.operations) {
                filterDefinition.operations.forEach(operation => {
                  if (expression && operation.type === 'exists') {
                    expression = this.stringifyFilterExists(operation, expression);
                  }
                });
              }
            }
          }
          return expression;
        }
      } else {
        return this.stringifyFilterExpression(field, null, filterMetadata);
      }
    }
    return null;
  }

  private static stringifyFilterExpression(field: string, type: string | null, filterMetadata: FilterMetadata): string | null {
    if (!field || !filterMetadata) {
      return null;
    }
    // can now handle multiple OR clauses supplied by user in the form of ||<clause>
    const operator = filterMetadata.matchMode;
    let value = filterMetadata.value;

    if (Array.isArray(value)) {
      if (value.length > 0) {
        let modValue = Object.assign([], value);
        const orClauses: string[] = [];
        let orIndex = Math.max(modValue.findIndex((element) => {
          return (typeof element === 'string') && (element as string)?.includes('||');
        }), modValue.findIndex((element) => element === null));

        while (orIndex > -1) {
          const orValue = modValue.splice(orIndex, 1)[0];

          if (orValue === null) {
            orClauses.push(`${field} equals null`); // [blank] option
          } else if ((typeof orValue === 'string') && (orValue as string).includes('||')) {
            orClauses.push((orValue as string).replace('||', '')); // user supplied OR clause
          }
          // find the next OR index
          orIndex = Math.max(modValue.findIndex((element) => (element as string)?.includes('||')), modValue.findIndex((element) => element === null));
        }

        if (modValue.length > 0) {
          orClauses.push(`${field} ${operator} (${modValue.map(v => this.formatFilterValue(type, v)).join(',')})`);
        }

        return orClauses.join(' OR ');
      }
    } else {
      // Do not process empty string.  This can cause issues on the
      // backend call especially when chaining together with exists.
      if (value === '' && type === "string") {
        return null;
      }
      return `${field} ${operator} ${this.formatFilterValue(type, value)}`;
    }
    return null;
  }

  private static stringifyFilterExists(operation: FilterOperation, expression: string): string {
    if (operation.conditions && operation.conditions.length > 0) {
      const conditions: string = operation.conditions.join(') and (');
      return `exists(${operation.path}, (${expression}) and ((${conditions})))`;
    } else {
      return `exists(${operation.path}, ${expression})`;
    }
  }

  private static stringifyFilterBooleanReplace(filterDefinition: FilterDefinition, filterMetadata: FilterMetadata): string {
    const field = filterDefinition.field;
    const type = filterDefinition.type;
    let operator = filterMetadata.matchMode;
    let value = filterMetadata.value;
    if (!field || !type || !operator) {
      return '';
    }

    const replacements = filterDefinition.replacements;
    if (replacements) {
      for (let i = 0; i < replacements.length; i++) {
        if (value !== undefined && value === replacements[i].value) {
          value = replacements[i].replace;
          operator = replacements[i].mode;
          break;
        }
      }
    }
    return `${field} ${operator} ${this.formatFilterValue(type, value)}`;
  }

  private static stringifyFilterBooleanExists(filterDefinition: FilterDefinition, filterMetadata: FilterMetadata): string {
    const field = filterDefinition.field;
    const value = filterMetadata.value;
    if (value === true) {
      return `exists(${field}, 1=1)`;
    } else {
      return `not exists(${field}, 1=1)`;
    }
  }

  private static formatFilterValue(type: string | null, value: any): string {
    if (type === 'string' || typeof value === 'string' || value instanceof String) {
      return '`' + value + '`';
    } else if (value instanceof Date) {
      const date = (value as Date).toISOString();
      return date.substring(0, date.indexOf("T") + 1);
    }
    return value;
  }
}
