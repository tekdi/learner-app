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
      const parentData = await courseDetails(identifier);
      const parentProgram = parentData?.result?.content?.program;
      console.log('########## page', page);
      console.log('########## type', type);
      console.log('########## identifier', identifier);
      console.log('########## program', program);

      // Check program authorization
       {
        try {
          // Get stored program from tenantData
          const tenantData = JSON.parse(await getDataFromStorage('tenantData')) || {};
          const storedProgram = tenantData?.[0]?.tenantName;
          

          // Normalize programs for comparison (handle both array and string)
          // const normalizeProgram = (prog) => {
          //   if (!prog) return null;
          //   if (Array.isArray(prog)) {
          //     return prog.map(p => String(p).toLowerCase().trim());
          //   }
          //   return [String(prog).toLowerCase().trim()];
          // };

          // const normalizedDeepLinkProgram = normalizeProgram(parentProgram);
          // const normalizedStoredProgram = normalizeProgram(storedProgram);

          // Check if programs don't match
          if(parentData){
            // const deepLinkPrograms = normalizedDeepLinkProgram;
            // const storedPrograms = normalizedStoredProgram;
            
            // Check if any deep link program matches any stored program
            const hasMatch = parentProgram?.some(deepLinkProg => 
              storedProgram.includes(deepLinkProg)
            );
            
            
            if (!hasMatch) {
              console.log('Unauthorized: Program mismatch in DeepLink', {
                deepLinkProgram: program,
                storedProgram: storedProgram
              });
              navigation.navigate('UnauthorizedScreen');
              return;
            }
          }
        } catch (error) {
          console.log('Error checking program in DeepLink:', error);
          // Continue with normal flow if check fails
        }
      }

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
  } catch (e) {
    console.log('Error in deepLinkCheck:', e);
  }
};
