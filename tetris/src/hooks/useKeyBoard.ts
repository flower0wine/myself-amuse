/* 
  功能描述: keyBoard Hook
  创建时间: 2024年 03月 01日
 */

export type KeyBoardHandler = (e: KeyboardEvent) => void;

export interface UseKeyBoardReturn {
    addEventHandler: (code: string, handler: KeyBoardHandler, keydown?: boolean) => void,
    disableAllShortcutKey: () => void,
    enableAllShortcutKey: () => void
}

export function useKeyBoard(): UseKeyBoardReturn {
    const keydownHandlerMap: Map<string, KeyBoardHandler[]> = new Map();
    const keyupHandlerMap: Map<string, KeyBoardHandler[]> = new Map();

    let enableShortcutKey = true;

    function disableAllShortcutKey(): void {
        enableShortcutKey = false;
    }

    function enableAllShortcutKey(): void {
        enableShortcutKey = true;
    }

    /**
     * 添加键盘处理事件
     * @param code 键码
     * @param handler 处理函数
     * @param [keydown=false] 是否是键盘按下事件, 默认为 false
     */
    function addEventHandler(code: string, handler: KeyBoardHandler, keydown: boolean = false): void {
        const addHandler = (map: Map<string, KeyBoardHandler[]>) => {
            const exist = map.has(code);
            const handlers = exist ? map.get(code) : [];
            handlers.push(handler);
            !exist && map.set(code, handlers);
        };
        keydown ? addHandler(keydownHandlerMap) : addHandler(keyupHandlerMap);
    }

    function execHandlers(map: Map<string, KeyBoardHandler[]>, e: KeyboardEvent): void {
        if(!enableShortcutKey)
            return;
        const code = e.code;
        const handlers = map.get(code);
        handlers?.forEach(handler => handler(e));
    }

    window.addEventListener("keydown", (e) => {
        execHandlers(keydownHandlerMap, e);
    });
    window.addEventListener("keyup", (e) => {
        execHandlers(keyupHandlerMap, e);
    });

    return {
        addEventHandler,
        disableAllShortcutKey,
        enableAllShortcutKey
    }
}