// Utilities
import { getCurrentInstance as _getCurrentInstance } from "vue";
// Types
import { type ComponentInternalInstance } from "vue";

import { helpers } from "@utils";

export function getCurrentInstance(name: string, message?: string) {
  const vm = _getCurrentInstance();

  if (!vm) {
    throw new Error(
      `${name} ${message || "must be called from inside a setup function"}`,
    );
  }

  return vm;
}

export function getCurrentInstanceName(name = "composables") {
  const vm = getCurrentInstance(name).type;

  return helpers.toKebabCase(vm?.name);
}

let _uid = 0;
let _map = new WeakMap<ComponentInternalInstance, number>();
export function getUid() {
  //https:github.com/uuidjs/uuid
  const vm = getCurrentInstance("getUid");

  if (_map.has(vm)) return _map.get(vm)!;
  else {
    const uid = _uid++;
    _map.set(vm, uid);
    return uid;
  }
}

getUid.reset = () => {
  _uid = 0;
  _map = new WeakMap();
};
