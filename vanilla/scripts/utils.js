var Utils = (() => {
    function makeId() {
        return (Math.random() + 1).toString(36).substring(7);
    }
    
    function deepClone(obj, complexTypesMap) {
        let clone = JSON.parse(JSON.stringify(obj));
        return complexTypesMap(clone);
    }
    
    function cloneTodo(todo) {
        const mapComplex = (todo) => {
            return {...todo, createdAt: new Date(todo.createdAt)};
        }
    
        return deepClone(todo, mapComplex);
    }

    return {
        makeId: makeId,
        deepClone: deepClone,
        cloneTodo: cloneTodo
    };
})()