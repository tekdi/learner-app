export const TENANT_DATA = {
  TENANT_NAME: 'tenantName',
  SECOND_CHANCE_PROGRAM: 'Second Chance Program',
  SECOND_CHANCE_PROGRAM_PATHWAYS: 'Second Chance Program Pathways',
  PRATHAM_SCP: 'pratham SCP',
  YOUTHNET: 'Vocational Training',
  MENTOR: 'mentor',
  LEADER: 'leader',
  CAMP_TO_CLUB: 'Camp to Club',

  POS: 'Open School',
  PRAGYANPATH: 'Pragyanpath',
};

// Content-platform (Ekstep) IDs used to fetch/filter content per program.
// SCP and SCP Pathways are both routed to userType === 'scp', but they use
// different content channels/frameworks on the backend, so lookups must be
// keyed off the actual tenant name, not just userType.
export const CONTENT_PLATFORM_IDS = {
  DEFAULT: { frameworkId: 'pos-framework', channelId: 'pos-channel' },
  SCP: {
    frameworkId: 'scp-framework',
    channelId: 'scp-channel',
    collectionFramework: 'scp-framework',
    questionSetFramework: 'scp-framework',
    boardId: 'scp-framework_board_cocurricular',
  },
  SCP_PATHWAYS: {
    frameworkId: 'pos-framework',
    channelId: 'pathways-channel',
    collectionFramework: 'pathwayFramework',
    questionSetFramework: 'pathwayFramework',
    // No confirmed board ID for Pathways content yet — leave unset (null)
    // rather than reusing SCP's board ID, which would silently filter out
    // every Pathways course whose content isn't tagged with that board.
    boardId: null,
  },
};
