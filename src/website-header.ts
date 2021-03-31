import { LitElement, html } from '@polymer/lit-element'

class WebsiteHeader extends LitElement {
    createRenderRoot() {
        return this
    }

    render() {
        return html`
            <style>
                .header-text {
                    font-family: 'Pacifico', cursive;
                    font-weight: 600;
                    font-size: 100px;
                    color: white;
                    line-height: 120px;
                    margin: 0;
                }

                .subtitle-text {
                    font-family: 'Abel', sans-serif;
                    color: white;
                    font-weight: 400;
                    font-size: 50px;
                }
            </style>
            <h1 class="header-text">Brandon Simon</h1>
            <span class="subtitle-text">Developer, Artist, Creative Person</span>
        `
    }
}

customElements.define('website-header', WebsiteHeader)