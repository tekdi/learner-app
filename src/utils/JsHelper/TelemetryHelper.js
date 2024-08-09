import { assessmentTracking } from '../API/AuthService';
import { getDataFromStorage } from './Helper';

export const handleTelemetryEvent = async (event, sectionContent) => {
  console.log('Telemetry Event', event?.detail);
  const data = event?.detail;
  let telemetry = {};
  let trackData = [];
  const sectionContent = await getDataFromStorage(QuestionSet);
  const identifierWithoutImg = sectionContent?.[0].identifier.replace(
    '.img',
    ''
  );
  const maxScore = sectionContent.maxScore;

  if (data && typeof data?.data === 'string') {
    telemetry = JSON.parse(data.data);
  } else if (data && typeof data === 'string') {
    telemetry = JSON.parse(data);
  } else if (data?.eid) {
    telemetry = data;
  }

  if (telemetry?.eid === 'ASSESS') {
    const edata = telemetry?.edata;

    if (edata?.resvalues && edata?.resvalues.length > 0) {
      const existingDataIndex = trackData.findIndex(
        (e) => e?.item?.id === edata?.item?.id
      );

      if (existingDataIndex >= 0) {
        trackData[existingDataIndex] = {
          ...edata,
          sectionName: sectionContent?.children?.find(
            (e) => e?.identifier === telemetry?.edata?.item?.sectionId
          )?.name,
        };
      } else {
        trackData.push({
          ...edata,
          sectionName: sectionContent?.children?.find(
            (e) => e?.identifier === telemetry?.edata?.item?.sectionId
          )?.name,
        });
      }
    }
    localStorage.setItem('trackDATA', JSON.stringify(trackData));
  } else if (telemetry?.eid === 'END') {
    let originalDuration = event?.detail?.edata?.duration;
    let newDuration = originalDuration / 10;
    let seconds = (newDuration = Math.round(newDuration * 10) / 10);

    localStorage.setItem('totalDuration', seconds);
  }

  const endPageSeen = telemetry?.edata?.extra?.find(
    (item) => item.id === 'endpageseen'
  );

  if (endPageSeen && endPageSeen.value === 'true' && !apiCalled) {
    apiCalled = true;

    let trackDataOld = localStorage.getItem('trackDATA');
    let trackDataParsed = JSON.parse(trackDataOld);
    let scoreDetails;

    const newFormatData = trackDataParsed.reduce((acc, obj) => {
      const existingSection = acc.find(
        (e) => e.sectionId === obj['item']['sectionId']
      );

      if (existingSection) {
        existingSection.data.push(obj);
      } else {
        acc.push({
          sectionId: obj['item']['sectionId'],
          sectionName: obj['sectionName'] || '',
          data: [obj],
        });
      }
      return acc;
    }, []);

    scoreDetails = JSON.stringify(newFormatData);

    const secondsString = localStorage.getItem('totalDuration');
    const seconds = Number(secondsString);

    try {
      await assessmentTracking(
        scoreDetails,
        identifierWithoutImg,
        maxScore,
        seconds
      );

      //   setModalOpen(true);
    } catch (error) {
      console.error('Error submitting assessment:', error);
    }
  } else {
    console.log('End page not seen, API call not made.');
  }
};
