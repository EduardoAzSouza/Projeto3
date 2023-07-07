import { styled } from "../stitches.config";

export const Header = styled("div", {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    maxHeight: "53px"
});

export const Title = styled("h1", {
    display: "block",
    fontSize: "2.4em",
    fontWeight: "bold",
    fontFamily: "Garamond"
});

export const SubTitle = styled("h2", {
    display: "block",
    fontSize: "1.8em",
    fontWeight: "bold",
    fontFamily: "Garamond"
});

export const Info = styled("div", {
    display: "flex",
    flexDirection:"row",

});

export const List = styled("ul", {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    verticalAlign: "middle",
    justifyContent: "space-between"
});


export const Main = styled("div", {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    flexGrow: "1",
    textAlign: "center",
    padding: "1rem",
    "& p": {
        fontSize: "1.6rem",
        color: "$grey600",
    },
    gap:"50px"
});

export const Horizon = styled("div", {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: "25px"
    
})

export const Text = styled("p", {
    maxWidth: "800px",
    textAlign: "justify",
    "& span": {
        fontSize: "4rem",
        float: "left",
        marginRight: "0.1em",
        lineHeight: "0.9",
    },
});

export const Buttons = styled("div", {
    display: "flex",
    flexDirection: "row",
    width: "30%",
    height: "100%",
    alignItems: "center",
    justifyContent: "space-evenly",
    padding: "2rem",
    color: "#333"
});