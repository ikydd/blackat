

const unselected = (option) => ({...option, selected: false });
const nestedUnselected = (option) => ({...option, selected: false, items: option.items.map(unselected) });
const setNormalSelection = (storage) => (option) => ({...option,
    selected: storage.includes(option.code)
});
const setNestedSelection = (storage) => (group) => ({...group,
    selected: storage.includes(group.code),
    items: group.items.map(setNormalSelection(storage))
});

const init = ({ side } = {}) => Object.assign({}, {
    side: side || "runner",
    sort: "faction",
    title: "",
    text: "",
    factions: [],
    types: [],
    subtypes: [],
    packs: []
});

const save = (data) => {
    let storage = init();
    const normalFilters = ['factions', 'types', 'subtypes'];
    const nestedFilters = ['packs'];

    const { side, sort, title, text } = data;
    storage = Object.assign(storage, { side, sort, title, text });

    storage = normalFilters.reduce((data, type) =>
        ({ ...data,
            [type]: data[type]
            .filter(({ selected }) => selected)
            .map(({ code }) => code)
        }), storage)
    storage = nestedFilters.reduce((data, type) =>
    ({ ...data,
        [type]: data[type]
            .reduce((list, { code, selected, items }) => list.concat(
            (selected ? [code] : [])
                .concat(items
                .filter(({ selected }) => selected)
                .map(({ code }) => code)
                )), [])
    }), storage);

    localStorage.setItem('settings', JSON.stringify(storage));
}

const integrate = (store, { factions, types, packs, subtypes }) => {
    const previousSession = store && localStorage.getItem('settings');
    if (previousSession) {
        try {
            const storage = JSON.parse(previousSession);
            const { side, sort, title, text } = storage;
            const settings = {};
            settings.side = side || undefined;
            settings.sort = sort || undefined;
            settings.title = title || undefined;
            settings.text = text || undefined;
            settings.factions = Array.isArray(storage.factions) ? factions.map(setNormalSelection(storage.factions)) : factions;
            settings.types = Array.isArray(storage.types) ? types.map(setNormalSelection(storage.types)) : types;
            settings.subtypes = Array.isArray(storage.subtypes) ? subtypes.map(setNormalSelection(storage.subtypes)) : subtypes;
            settings.packs = Array.isArray(storage.packs) ? packs.map(setNestedSelection(storage.packs)) : packs;

            return settings;

        } catch (e) {
            // fail silently
        }
    }
    return {
        factions: factions.map(unselected),
        types: types.map(unselected),
        subtypes: subtypes.map(unselected),
        packs: packs.map(nestedUnselected),
    }
}

export {
    init,
    save,
    integrate
}
