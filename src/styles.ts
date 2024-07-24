import { css } from "lit";

export const sharedStyles = css`

    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');

    :host {
        font-family: "Inter", sans-serif;
        font-optical-sizing: auto;
        font-weight: 400;
        font-style: normal;
        font-variation-settings:
            "slnt" 0;
        font-size: 20px;
        color: white;
    }

    h1, h2, h3, h4, h5, p, button {
        font-weight: 400;
        font-size: 20px;
        line-height: 20px;
        margin: 0;
        padding: 0;
    }

`;