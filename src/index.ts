import { LitElement, html, property } from '@polymer/lit-element'
import { installRouter } from 'pwa-helpers/router.js';
import './background-art'
import './website-header'

class WebsiteApp extends LitElement {
    @property({
        type: {
            toAttribute: location => location.href,
            fromAttribute: location => new URL(location)
        }
    })
    location = window.location

    constructor() {
        super()
        installRouter(location => this.location = location)
    }

    createRenderRoot() {
        return this
    }

    render() {
        return html`
            <style>
               .full-screen {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100vw;
                    height: 100vh;
                }

                .behind-everything {
                    z-index: -1;
                }
                
                .header-grid-area {
                    grid-row: 2 / 3;
                    grid-column: 2 / 3;
                }
            </style>
            <background-art class="full-screen behind-everything"></background-art>
            <website-header class="header-grid-area"></website-header>

        `
    }
}

customElements.define('website-app', WebsiteApp)