export const TOGGLE_THEME = "TOGGLE_THEME";

export const toggleTheme = ()=>(dispatch)=>{
    try {
        dispatch({
            type:TOGGLE_THEME
        });
    } catch (error) {
        console.log(error);
    }
}