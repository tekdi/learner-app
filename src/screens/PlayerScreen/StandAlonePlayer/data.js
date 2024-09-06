export const qumlPlayerConfig = {
  context: {
    threshold: 3,
    mode: 'play',
    authToken: ' ',
    sid: '',
    did: '',
    uid: '',
    channel: '',
    pdata: {
      id: 'preprod.diksha.portal',
      ver: '3.3.0',
      pid: 'sunbird-portal.contentplayer',
    },
    contextRollup: {
      l1: 'string',
      l2: 'string',
      l3: 'string',
      l4: 'string',
    },
    tags: [],
    cdata: [
      {
        id: '',
        type: 'ContentSession',
      },
      {
        id: '',
        type: 'PlaySession',
      },
    ],
    timeDiff: 5,
    objectRollup: {
      l1: 'string',
      l2: 'string',
      l3: 'string',
      l4: 'string',
    },
    host: '',
    endpoint: '',
    userData: {
      firstName: '',
      lastName: '',
    },
  },
  metadata: {},
  config: {
    traceId: '',
    sideMenu: {
      showShare: false,
      showDownload: false,
      showExit: false,
      showPrint: false,
      showReplay: false,
    },
  },
};

export const questionsData = {
  questions_data: {},
};

export const contentPlayerConfig = {
  context: {},
  config: { showEndPage: true },
  metadata: {},
  data: {},
};

export const pdfPlayerConfig = {
  context: {
    mode: 'play',
    partner: [],
    pdata: {
      id: 'dev.sunbird.portal',
      ver: '5.2.0',
      pid: 'sunbird-portal',
    },
    contentId: '',
    sid: '',
    uid: '',
    timeDiff: -0.089,
    channel: '',
    tags: [''],
    did: '',
    contextRollup: { l1: '' },
    objectRollup: {},
    userData: { firstName: '', lastName: '' },
  },
  config: {
    showEndPage: false,
    endPage: [{ template: 'assessment', contentType: ['SelfAssess'] }],
    showStartPage: true,
    host: '',
    overlay: { showUser: false },
    splash: {
      text: '',
      icon: '',
      bgImage: 'assets/icons/splacebackground_1.png',
      webLink: '',
    },
    apislug: '/action',
    repos: ['/sunbird-plugins/renderer'],
    plugins: [
      { id: 'org.sunbird.iframeEvent', ver: 1, type: 'plugin' },
      { id: 'org.sunbird.player.endpage', ver: 1.1, type: 'plugin' },
    ],
    sideMenu: {
      showShare: false,
      showDownload: false,
      showExit: false,
      showPrint: false,
      showReplay: true,
    },
  },
  metadata: {},
  data: {},
};

export const videoPlayerConfig = {
  context: {
    mode: 'play',
    authToken: '',
    sid: '',
    did: '',
    uid: '',
    channel: '',
    pdata: {
      id: 'prod.diksha.portal',
      ver: '3.2.12',
      pid: 'sunbird-portal.contentplayer',
    },
    contextRollup: { l1: '' },
    tags: [''],
    cdata: [],
    timeDiff: 0,
    objectRollup: {},
    host: '',
    endpoint: '',
    userData: {
      firstName: '',
      lastName: '',
    },
  },
  config: {
    traceId: '',
    sideMenu: {
      showShare: false,
      showDownload: false,
      showExit: false,
      showPrint: false,
      showReplay: true,
    },
  },
  metadata: {},
  data: {},
};

export const epubPlayerConfig = {
  context: {
    mode: 'play',
    authToken: '',
    sid: '',
    did: '',
    uid: '',
    channel: '',
    pdata: {
      id: 'prod.diksha.portal',
      ver: '3.2.12',
      pid: 'sunbird-portal.contentplayer',
    },
    contextRollup: { l1: '' },
    tags: [''],
    cdata: [],
    timeDiff: 0,
    objectRollup: {},
    host: '',
    endpoint: '',
    userData: {
      firstName: '',
      lastName: '',
    },
  },
  config: {
    traceId: '',
    sideMenu: {
      showShare: false,
      showDownload: false,
      showExit: false,
      showPrint: false,
      showReplay: true,
    },
  },
  metadata: {},
  data: {},
};
