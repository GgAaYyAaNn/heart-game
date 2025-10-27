export const heartApi = (()=>{
    async function getGame(){
        let resp = await fetch("https://marcconrad.com/uob/heart/api.php");
        let data = JSON.parse(await resp.text());
        return {
            imgSrc: data["question"],
            solution: data["solution"]
        }
    }

    return {
        getGame
    }
})();
