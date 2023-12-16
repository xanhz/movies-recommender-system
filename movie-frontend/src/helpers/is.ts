export function isNil(val: any): val is null | undefined {
  return val == null;
}

export function isNumber(val: any): val is number {
  return typeof val === 'number';
}

export function isString(val: any): val is string {
  return typeof val === 'string';
}

export function isArray(val: any): val is any[] {
  return Array.isArray(val);
}

export function isObject(val: any): val is object {
  return typeof val === 'object';
}

export function isNumeric(val: any) {
  if (isString(val)) {
    return /^-?\d+(\.\d+)?$/.test(val);
  }
  return isNumber(val);
}

export function isEmpty(val: any) {
  if (isNil(val)) {
    return true;
  }
  if (isObject(val)) {
    if ('length' in val && isNumber(val.length)) {
      return val.length === 0;
    }
    if ('size' in val && isNumber(val.size)) {
      return val.size === 0;
    }
    return Object.keys(val).length === 0;
  }
  return false;
}
