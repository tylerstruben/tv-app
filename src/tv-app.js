import { LitElement, html, css } from 'lit';
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import "./tv-channel.js";
import "@lrnwebcomponents/video-player/video-player.js";
export class TvApp extends LitElement {
  static get tag() {
    return 'tv-app';
  }
  static get properties() {
    return {
      appName: { type: String },
      source: { type: String },
      channelList: { type: Array },
      activeIndex: { type: Number}
      
    };
  }
  constructor() {
    super();
    this.appName = '';
    this.source = new URL('../assets/channels.json', import.meta.url).href;
    this.channelList = [];
    this.activeIndex = 0;
  }
  static get styles() {
    return [
      css`
        :host {
          font-family: 'Arial', sans-serif;
          display: block;
          background-color: #f8f8f8;
          color: #333;
        }
        .app-container {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 20px;
          padding: 20px;
        }
        .video-section {
          grid-column: 1;
        }
        .description-box {
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          padding: 20px;
          margin-top: 20px;
        }
        .channel-list {
          grid-column: 2;
          background-color: #fff;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); 
          overflow-y: auto; 
          max-height: 700px;
        }
        .thumbnail {
          max-width: 100%;
          height: auto;
        }
        .controls {
          display: flex;
          justify-content: space-between;
          margin-top: 20px;
          padding: 10px 20px;
          
          border-radius: 5px;
        
        }
        .prev-button,
        .next-button {
          font-size: 16px;
          padding: 10px 20px;
          background-color: #007bff;
          color: #fff;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        .prev-button:hover,
        .next-button:hover {
          background-color: #0056b3;
        }
      `,
    ];
  }
  render() {
    return html`
      <div class="app-container">
        <div class="video-section">
          
          
      <video-player source="https://www.youtube.com/watch?v=hrbNqEFTbrU" accent-color="blue"></video-player> 
      <h2>Pink Panther. My Favorite Episode.</h2> 
      <div class="description-box">
  
      ${this.channelList.length > 0 ? this.channelList[this.activeIndex].description : ''}

      </div>
      <div class="controls">
      <button class="prev-button" @click="${this.prevSlide}">Previous</button>
      <button class="next-button" @click="${this.nextSlide}">Next</button>
      </div>
        </div>  
        <div class="channel-list">
          <h2>${this.appName}</h2>
          ${this.channelList.map(
            (item, index) => html`
              <tv-channel 
                ?active="${index === this.activeIndex}"
                index="${index}"
                title="${item.title}"
                presenter="${item.metadata.author}"
                @click="${this.itemClick}"
                timecode="${item.metadata.timecode}"
                thumbnail="${item.metadata.thumbnail}"
                minuteTranslation="${item.metadata.minuteTranslation}" 
                
              ></tv-channel> 
              
            `
          )}
          
        </div>
      </div>
      
    `;
  }
  itemClick(e) { 
    
    // Handle channel item click
    console.log(e.target);
    this.activeIndex= e.target.index; 
    this.shadowRoot.querySelector('video-player').shadowRoot.querySelector("a11y-media-player").media.currentTime;
    this.shadowRoot.querySelector('video-player').shadowRoot.querySelector('a11y-media-player').play();
    this.shadowRoot.querySelector('video-player').shadowRoot.querySelector('a11y-media-player').seek(e.target.timecode);
    }

  updated(changedProperties) {
    super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "source" && this[propName]) {
        this.updateChannelList(this[propName]);
      }

      if(propName === "activeIndex"){ 
        console.log(this.shadowRoot.querySelectorAll("tv-channel"));
        console.log(this.activeIndex)

        var activeChannel = this.shadowRoot.querySelector("tv-channel[index = '" + this.activeIndex + "' ] ");

        console.log(activeChannel);
        this.shadowRoot.querySelector('video-player').shadowRoot.querySelector('a11y-media-player').seek(activeChannel.timecode);
      }

    });
  }
  prevSlide() {
    this.activeIndex = Math.max(0, this.activeIndex - 1);
    
  }
  nextSlide() {
    this.activeIndex = Math.min(this.channelList.length - 1, this.activeIndex + 1);  
  }
  connectedCallback() {
    super.connectedCallback();
    
    setInterval(() => {
      const currentTime = this.shadowRoot.querySelector('video-player').shadowRoot.querySelector('a11y-media-player').media.currentTime;
      if (this.activeIndex + 1 < this.channelList.length &&
          currentTime >= this.channelList[this.activeIndex + 1].metadata.timecode) {
        this.activeIndex++;
      }
    }, 1000);
  }
  async updateChannelList(source) {
    await fetch(source).then((resp) => resp.ok ? resp.json() : []).then((responseData) => {
      if (responseData.status === 200 && responseData.data.items && responseData.data.items.length > 0) {
        this.channelList = [...responseData.data.items];
      }
    });
  }
}
customElements.define(TvApp.tag, TvApp); 
