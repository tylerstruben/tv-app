import { LitElement, html, css } from 'lit';

export class TvChannel extends LitElement {
  static get tag() {
    return 'tv-channel';
  }

  static get properties() {
    return {
      title: { type: String },
      video: { type: String },
      presenter: { type: String },
      timecode: { type: Number },
      description: { type: String },
      thumbnail: { type: String },
      description: { type: String },
      active: {type: Boolean, reflect: true},
      index: {type: Number},
      minuteTranslation: {type: String}
    };
  }

  constructor() {
    super();
    this.title = '';
    this.video = '';
    this.presenter = '';
    this.thumbnail = '';
    this.description = '';
    this.minuteTranslation = '';
  }

  static get styles() {
    return css`
      :host {
        display: block;
        padding: 15px;
        background-color: #eeeeee;
        margin-top: 12px;
        border-radius: 8px;
        transition: background-color 0.3s ease;
      }

      
      :host([active]) {
        background-color: #007bff;
      }

      .thumbnail {
        max-width: 100%;
        height: auto;
        margin-bottom: 10px;
        object-fit: cover;
        
      }

      h3, h4, h5 {
        margin: 0;
        line-height: 1.2;
      }

      h3 {
        font-size: 18px;
        color: #333;
      }

      h4 {
        font-size: 16px;
        color: #555;
      }

      h5 {
        font-size: 14px;
        color: #777;
      }
    `;
  }

  render() {
    return html`
      <img class="thumbnail" src="${this.thumbnail}" alt="${this.title}">
      <h3>${this.title}; ${this.minuteTranslation}</h3>
      <h4>${this.presenter}</h4>
      <h5>${this.description}</h5>
      <slot></slot>
    `;
  }
}

customElements.define(TvChannel.tag, TvChannel);