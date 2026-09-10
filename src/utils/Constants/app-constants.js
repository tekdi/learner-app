export const TENANT_DATA = {
    TENANT_NAME: 'tenantName',
    SECOND_CHANCE_PROGRAM: 'Second Chance Program',
    SECOND_CHANCE_PROGRAM_PATHWAYS: 'Second Chance Program Pathways',
    PRATHAM_SCP: 'pratham SCP',
    YOUTHNET: 'Vocational Training',
    MENTOR: 'mentor',
    LEADER: 'leader',
    CAMP_TO_CLUB : 'Camp to Club',

    POS :'Open School',
    PRAGYANPATH : 'Pragyanpath',

  };

// Emitted whenever the user switches their active enrolled program from
// within the app, so screens that don't get recreated (no nav reset, or a
// dashboard reused across programs) can still react and re-fetch.
export const PROGRAM_SWITCHED_EVENT = 'PROGRAM_SWITCHED';