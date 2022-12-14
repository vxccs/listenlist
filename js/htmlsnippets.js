const showCollectionCardImgHTML = `
      <div class="maincard__img">
            <img>
            <div class="maincard__buttons d-flex align-center">
                <svg id="openSpotifyCard" viewbox="0 0 24 24">
                    <g>
                        <g>
                            <g>
                                <path
                                    d="M12,0C5.373,0,0,5.373,0,12c0,6.628,5.373,12,12,12c6.628,0,12-5.372,12-12C24,5.373,18.628,0,12,0z M17.503,17.308     c-0.216,0.354-0.676,0.464-1.028,0.249c-2.818-1.722-6.365-2.111-10.542-1.157c-0.403,0.092-0.804-0.16-0.896-0.562     c-0.092-0.402,0.159-0.804,0.563-0.895c4.571-1.045,8.492-0.595,11.655,1.338C17.608,16.495,17.719,16.956,17.503,17.308z      M18.972,14.041c-0.271,0.44-0.847,0.578-1.287,0.308c-3.225-1.982-8.142-2.557-11.958-1.398C5.233,13.1,4.71,12.821,4.56,12.327     c-0.149-0.495,0.13-1.016,0.624-1.167c4.358-1.323,9.776-0.682,13.48,1.594C19.104,13.025,19.242,13.601,18.972,14.041z      M19.098,10.638C15.23,8.341,8.85,8.13,5.157,9.251c-0.593,0.18-1.22-0.155-1.4-0.748c-0.18-0.593,0.155-1.22,0.748-1.4     c4.239-1.287,11.285-1.038,15.738,1.605c0.533,0.317,0.708,1.005,0.392,1.538C20.32,10.779,19.63,10.955,19.098,10.638z" />
                            </g>
                        </g>
                    </g>
                </svg>
                <svg id="removeFromCollectionCard" viewbox="0 0 330 330">
                    <g id="XMLID_28_">
                        <path id="XMLID_29_" d="M165,0C120.926,0,79.492,17.163,48.328,48.327c-64.334,64.333-64.334,169.011-0.002,233.345
                            C79.49,312.837,120.926,330,165,330c44.072,0,85.508-17.163,116.672-48.328c64.334-64.334,64.334-169.012,0-233.345
                            C250.508,17.163,209.072,0,165,0z M239.246,239.245c-2.93,2.929-6.768,4.394-10.607,4.394c-3.838,0-7.678-1.465-10.605-4.394
                            L165,186.213l-53.033,53.033c-2.93,2.929-6.768,4.394-10.607,4.394c-3.838,0-7.678-1.465-10.605-4.394
                            c-5.859-5.857-5.859-15.355,0-21.213L143.787,165l-53.033-53.033c-5.859-5.857-5.859-15.355,0-21.213
                            c5.857-5.857,15.355-5.857,21.213,0L165,143.787l53.031-53.033c5.857-5.857,15.355-5.857,21.213,0
                            c5.859,5.857,5.859,15.355,0,21.213L186.213,165l53.033,53.032C245.104,223.89,245.104,233.388,239.246,239.245z"/>
                    </g>
                </svg>
            </div>
        </div>
    `;

const userSettingsDivInHTML = `
        <div class="d-flex">
            <svg viewbox="0 0 24 24">
                <path d="M1.172,19.119A4,4,0,0,0,0,21.947V24H2.053a4,4,0,0,0,2.828-1.172L18.224,9.485,14.515,5.776Z" />
                <path d="M23.145.855a2.622,2.622,0,0,0-3.71,0L15.929,4.362l3.709,3.709,3.507-3.506A2.622,2.622,0,0,0,23.145.855Z" />
            </svg>
            <div>
                Tama??o de fuente
                <div class="font-size-control">
                    <div>-</div>
                    <div>Reset</div>
                    <div>+</div>
                </div>
            </div>
        </div>
        <div id="logoutBtn" class="d-flex align-center">
            <svg viewbox="0 0 512 512">
                <g>
                    <path d="M170.698,448H72.757c-4.814-0.012-8.714-3.911-8.725-8.725V72.725c0.012-4.814,3.911-8.714,8.725-8.725h97.941   c17.673,0,32-14.327,32-32s-14.327-32-32-32H72.757C32.611,0.047,0.079,32.58,0.032,72.725v366.549   C0.079,479.42,32.611,511.953,72.757,512h97.941c17.673,0,32-14.327,32-32S188.371,448,170.698,448z"/>
                    <path d="M483.914,188.117l-82.816-82.752c-12.501-12.495-32.764-12.49-45.259,0.011s-12.49,32.764,0.011,45.259l72.789,72.768   L138.698,224c-17.673,0-32,14.327-32,32s14.327,32,32,32l0,0l291.115-0.533l-73.963,73.963   c-12.042,12.936-11.317,33.184,1.618,45.226c12.295,11.445,31.346,11.436,43.63-0.021l82.752-82.752   c37.491-37.49,37.491-98.274,0.001-135.764c0,0-0.001-0.001-0.001-0.001L483.914,188.117z"/>
                </g>
            </svg>
            Cerrar sesi??n
        </div>
    `;

const userSettingsDivOutHTML = `
      <div id="loginBtn" class="d-flex align-center">
          <svg viewbox="0 0 512 512">
              <path d="M170.699,448H72.757c-4.814-0.012-8.714-3.911-8.725-8.725V72.725c0.012-4.814,3.911-8.714,8.725-8.725h97.941   c17.673,0,32-14.327,32-32s-14.327-32-32-32H72.757C32.612,0.047,0.079,32.58,0.032,72.725v366.549   C0.079,479.42,32.612,511.953,72.757,512h97.941c17.673,0,32-14.327,32-32S188.372,448,170.699,448z"/>
              <path d="M480.032,224l-290.987,0.576l73.941-73.941c12.501-12.495,12.506-32.758,0.011-45.259s-32.758-12.506-45.259-0.011   l-82.752,82.752c-37.491,37.49-37.491,98.274-0.001,135.764c0,0,0.001,0.001,0.001,0.001l82.752,82.752   c12.501,12.495,32.764,12.49,45.259-0.011s12.49-32.764-0.011-45.259l-72.811-72.789L480.032,288   c17.673-0.035,31.971-14.391,31.936-32.064S497.577,223.965,479.904,224H480.032z"/>
          </svg>
          Iniciar sesi??n
      </div>
      <div id="signupBtn" class="d-flex align-center">
          <svg viewbox="0 0 24 24">
              <g>
                  <path d="m12 0a12 12 0 1 0 12 12 12.013 12.013 0 0 0 -12-12zm0 21a9 9 0 1 1 9-9 9.01 9.01 0 0 1 -9 9zm5-9a1.5 1.5 0 0 1 -1.5 1.5h-2v2a1.5 1.5 0 0 1 -3 0v-2h-2a1.5 1.5 0 0 1 0-3h2v-2a1.5 1.5 0 0 1 3 0v2h2a1.5 1.5 0 0 1 1.5 1.5z"/>
              </g>
          </svg>
          Registrar
      </div>
      <div class="d-flex">
            <svg viewbox="0 0 24 24">
                <path d="M1.172,19.119A4,4,0,0,0,0,21.947V24H2.053a4,4,0,0,0,2.828-1.172L18.224,9.485,14.515,5.776Z" />
                <path d="M23.145.855a2.622,2.622,0,0,0-3.71,0L15.929,4.362l3.709,3.709,3.507-3.506A2.622,2.622,0,0,0,23.145.855Z" />
            </svg>
            <div>
                Tama??o de fuente
                <div class="font-size-control">
                    <div>-</div>
                    <div>Reset</div>
                    <div>+</div>
                </div>
            </div>
        </div>
    `;

const userSettingsDivInHTMLIndex = `
        <div id="collectionsBtn" class="d-flex align-center">
            <svg viewbox="0 0 24 24">
                <g>
                    <path d="M8,7H22.5a1.5,1.5,0,0,0,0-3H8A1.5,1.5,0,0,0,8,7Z"/><path d="M22.5,11H8a1.5,1.5,0,0,0,0,3H22.5a1.5,1.5,0,0,0,0-3Z"/><path d="M22.5,18H8a1.5,1.5,0,0,0,0,3H22.5a1.5,1.5,0,0,0,0-3Z"/><circle cx="2.5" cy="5.5" r="2.5"/><circle cx="2.5" cy="12" r="2.5"/><circle cx="2.5" cy="19" r="2.5"/>
                </g>
            </svg>
            Mi lista
        </div>
        <div class="d-flex">
            <svg viewbox="0 0 24 24">
                <path d="M1.172,19.119A4,4,0,0,0,0,21.947V24H2.053a4,4,0,0,0,2.828-1.172L18.224,9.485,14.515,5.776Z" />
                <path d="M23.145.855a2.622,2.622,0,0,0-3.71,0L15.929,4.362l3.709,3.709,3.507-3.506A2.622,2.622,0,0,0,23.145.855Z" />
            </svg>
            <div>
                Tama??o de fuente
                <div class="font-size-control">
                    <div>-</div>
                    <div>Reset</div>
                    <div>+</div>
                </div>
            </div>
        </div>
        <div id="logoutBtn" class="d-flex align-center">
            <svg viewbox="0 0 512 512">
                <g>
                    <path d="M170.698,448H72.757c-4.814-0.012-8.714-3.911-8.725-8.725V72.725c0.012-4.814,3.911-8.714,8.725-8.725h97.941   c17.673,0,32-14.327,32-32s-14.327-32-32-32H72.757C32.611,0.047,0.079,32.58,0.032,72.725v366.549   C0.079,479.42,32.611,511.953,72.757,512h97.941c17.673,0,32-14.327,32-32S188.371,448,170.698,448z"/>
                    <path d="M483.914,188.117l-82.816-82.752c-12.501-12.495-32.764-12.49-45.259,0.011s-12.49,32.764,0.011,45.259l72.789,72.768   L138.698,224c-17.673,0-32,14.327-32,32s14.327,32,32,32l0,0l291.115-0.533l-73.963,73.963   c-12.042,12.936-11.317,33.184,1.618,45.226c12.295,11.445,31.346,11.436,43.63-0.021l82.752-82.752   c37.491-37.49,37.491-98.274,0.001-135.764c0,0-0.001-0.001-0.001-0.001L483.914,188.117z"/>
                </g>
            </svg>
            Cerrar sesi??n
        </div>
    `;

const userSettingsDivOutHTMLIndex = `
      <div id="loginBtn" class="d-flex align-center">
          <svg viewbox="0 0 512 512">
              <path d="M170.699,448H72.757c-4.814-0.012-8.714-3.911-8.725-8.725V72.725c0.012-4.814,3.911-8.714,8.725-8.725h97.941   c17.673,0,32-14.327,32-32s-14.327-32-32-32H72.757C32.612,0.047,0.079,32.58,0.032,72.725v366.549   C0.079,479.42,32.612,511.953,72.757,512h97.941c17.673,0,32-14.327,32-32S188.372,448,170.699,448z"/>
              <path d="M480.032,224l-290.987,0.576l73.941-73.941c12.501-12.495,12.506-32.758,0.011-45.259s-32.758-12.506-45.259-0.011   l-82.752,82.752c-37.491,37.49-37.491,98.274-0.001,135.764c0,0,0.001,0.001,0.001,0.001l82.752,82.752   c12.501,12.495,32.764,12.49,45.259-0.011s12.49-32.764-0.011-45.259l-72.811-72.789L480.032,288   c17.673-0.035,31.971-14.391,31.936-32.064S497.577,223.965,479.904,224H480.032z"/>
          </svg>
          Iniciar sesi??n
      </div>
      <div id="signupBtn" class="d-flex align-center">
          <svg viewbox="0 0 24 24">
              <g>
                  <path d="m12 0a12 12 0 1 0 12 12 12.013 12.013 0 0 0 -12-12zm0 21a9 9 0 1 1 9-9 9.01 9.01 0 0 1 -9 9zm5-9a1.5 1.5 0 0 1 -1.5 1.5h-2v2a1.5 1.5 0 0 1 -3 0v-2h-2a1.5 1.5 0 0 1 0-3h2v-2a1.5 1.5 0 0 1 3 0v2h2a1.5 1.5 0 0 1 1.5 1.5z"/>
              </g>
          </svg>
          Registrar
      </div>
      <div class="d-flex">
            <svg viewbox="0 0 24 24">
                <path d="M1.172,19.119A4,4,0,0,0,0,21.947V24H2.053a4,4,0,0,0,2.828-1.172L18.224,9.485,14.515,5.776Z" />
                <path d="M23.145.855a2.622,2.622,0,0,0-3.71,0L15.929,4.362l3.709,3.709,3.507-3.506A2.622,2.622,0,0,0,23.145.855Z" />
            </svg>
            <div>
                Tama??o de fuente
                <div class="font-size-control">
                    <div>-</div>
                    <div>Reset</div>
                    <div>+</div>
                </div>
            </div>
        </div>
    `;

const emptyGroupInHTML = `
    <img src="/images/empty-group.svg" alt="Colecci??n vac??a">
    <p>La m??sica que guardes aparecer?? aqu??</p>
    <p>Usa el buscador para empezar tu colecci??n!</p>
`;

const emptyGroupOutHTML = `
    <img src="/images/empty-group.svg" alt="Colecci??n vac??a">
    <p>La m??sica que guardes aparecer?? aqu??</p>
    <p><a href="/login.html">Inicia sesi??n</a> para empezar tu colecci??n!</p>
`;

const ctaInHTML = `
    <h4>Contin??a tu lista ahora!</h4>
    <div class="cta__buttons d-flex align-center">
        <a href="/app.html">Mi lista</a>
    </div>
`;

const ctaOutHTML = `
    <h4>Comienza tu lista ahora!</h4>
    <div class="cta__buttons d-flex align-center">
        <a href="/login.html">Iniciar sesi??n</a>
        <a href="/signup.html">Registrar</a>
    </div>
`;
