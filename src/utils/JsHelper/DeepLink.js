import { courseDetails, hierarchyContent, readContent } from '../API/ApiCalls';
import { getDataFromStorage, deleteSavedItem } from './Helper';

export const deepLinkCheck = async (navigation) => {
  try {
    const deeplinkData = await getDataFromStorage('deep_link_data');
    console.log('########## deeplinkData found', deeplinkData);
    const deeplinkDataJson = JSON.parse(deeplinkData);
    if (deeplinkDataJson) {

      await deleteSavedItem('deep_link_data');

      const { page, type, identifier, program } = deeplinkDataJson;
      console.log('########## page', page);
      console.log('########## type', type);
      console.log('########## identifier', identifier);
      console.log('########## program', program);

      //navigate
      if (type == 'course') {
        const data = await courseDetails(identifier);
        // console.log('########## data course', JSON.stringify(data?.result?.content?.leafNodes));
        navigation.navigate('CourseContentList', {
          do_id: identifier,
          course_id: identifier,
          content_list_node: data?.result?.content?.leafNodes,
        });
      }

      if (type == 'content') {
        console.log('########## content_do_id', identifier);
        let content_response = await readContent(identifier);
        // console.log('########## content_response', JSON.stringify(content_response?.result?.content?.mimeType));

        navigation.push('StandAlonePlayer', {
          content_do_id: identifier,
          content_mime_type: content_response?.result?.content?.mimeType,
          isOffline: false,
          course_id: identifier,
          unit_id: identifier,
        });
      }
    }
  } catch (e) {}
};
