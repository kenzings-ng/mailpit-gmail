import { createSlice } from "@reduxjs/toolkit";

const appSlice = createSlice({
    name: "app",
    initialState: {
        open: false,
        draft: null, // { to, subject } prefill for Compose (reply)
        sidebar: true,
        searchText: "",
        unread: 0,
        tags: [],
        list: { ids: [], start: 0, total: 0 }, // current inbox page, for "N of M" + prev/next in Mail
    },
    reducers: {
        // false closes, true opens blank, an object opens prefilled.
        setOpen: (state, action) => {
            state.open = action.payload !== false;
            state.draft = typeof action.payload === 'object' ? action.payload : null;
        },
        toggleSidebar: (state) => {
            state.sidebar = !state.sidebar;
        },
        setSearchText: (state, action) => {
            state.searchText = action.payload;
        },
        setInbox: (state, action) => {
            const { unread, tags, list } = action.payload;
            state.unread = unread;
            state.tags = tags || [];
            state.list = list;
        },
    }
});

export const { setOpen, toggleSidebar, setSearchText, setInbox } = appSlice.actions;

export default appSlice.reducer;
