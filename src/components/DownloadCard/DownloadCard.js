import React, { useState, useEffect } from 'react';
import download from '../../assets/images/png/download.png';
import download_inprogress from '../../assets/images/png/download_inprogress.png';
import download_complete from '../../assets/images/png/download_complete.png';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { getData, storeData } from '../../utils/Helper/JSHelper';
import { hierarchyContent, listQuestion, readContent } from '../../utils/API/ApiCalls';
import RNFS from 'react-native-fs';
import { unzip } from 'react-native-zip-archive';
import Config from 'react-native-config';
import NetworkAlert from '../NetworkError/NetworkAlert';

const DownloadCard = ({ contentId, contentMimeType }) => {
  const [downloadIcon, setDownloadIcon] = useState(download);
  const [downloadStatus, setDownloadStatus] = useState('');
  const questionListUrl = Config.QUESTION_LIST_URL;
  const [validDownloadFile, setValidDownloadFile] = useState(null);
  const [networkstatus, setNetworkstatus] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (
        contentMimeType == 'application/vnd.ekstep.ecml-archive' ||
        contentMimeType == 'application/vnd.ekstep.html-archive' ||
        contentMimeType == 'application/vnd.ekstep.h5p-archive' ||
        contentMimeType == 'application/pdf' ||
        contentMimeType == 'video/mp4' ||
        contentMimeType == 'application/epub' ||
        contentMimeType == 'application/vnd.sunbird.questionset'
      ) {
        setValidDownloadFile(true);
        let content_do_id = contentId;
        let contentObj = await getData(content_do_id, 'json');
        console.log('contentObj', contentObj);
        if (contentObj == null) {
          setDownloadStatus('download');
          setDownloadIcon(download);
        } else {
          setDownloadStatus('completed');
          setDownloadIcon(download_complete);
        }
      } else {
        setValidDownloadFile(false);
      }
    };

    fetchData();
  }, []);

  const handleDownload = async () => {
    if (
      contentMimeType == 'application/vnd.ekstep.ecml-archive' ||
      contentMimeType == 'video/x-youtube' ||
      contentMimeType == 'application/vnd.ekstep.html-archive' ||
      contentMimeType == 'application/vnd.ekstep.h5p-archive'
    ) {
      await downloadContentECMLH5pHTMLYoutube(contentId);
    } else if (
      contentMimeType == 'application/pdf' ||
      contentMimeType == 'video/mp4' ||
      contentMimeType == 'video/webm' ||
      contentMimeType == 'application/epub'
    ) {
      await downloadContentPDFEpubVideo(contentId);
    } else if (contentMimeType == 'application/vnd.sunbird.questionset') {
      await downloadContentQuML(contentId);
    } else {
    }
  };

  const downloadContentECMLH5pHTMLYoutube = async (content_do_id) => {
    const content_file = `${RNFS.DocumentDirectoryPath}/${content_do_id}`;
    const streamingPath = `${content_file}/${content_do_id}.json`;
    //content read
    setDownloadStatus('progress');
    setDownloadIcon(download_inprogress);
    //get data online
    let content_response = await readContent(content_do_id);
    if (content_response == null) {
      //Alert.alert('Error', 'Internet is not available', [{ text: 'OK' }]);
      setNetworkstatus(false);
      setDownloadStatus('download');
      setDownloadIcon(download);
    } else {
      let contentObj = content_response?.result?.content;
      let filePath = '';
      if (
        contentObj?.mimeType == 'application/vnd.ekstep.ecml-archive' ||
        contentObj?.mimeType == 'application/vnd.ekstep.html-archive' ||
        contentObj?.mimeType == 'application/vnd.ekstep.h5p-archive' ||
        contentObj?.mimeType == 'video/x-youtube'
      ) {
        filePath = `${content_file}.zip`;
      }
      if (filePath != '') {
        //download file and store object in local
        //download file
        // URL of the file to download
        //const fileUrl = contentObj?.artifactUrl;
        const fileUrl = contentObj?.downloadUrl;
        //console.log('fileUrl', fileUrl);
        try {
          if (contentObj?.mimeType == 'video/x-youtube') {
            //console.log('permission got');
            //store content obj
            //console.log(contentObj);
            await storeData(content_do_id, contentObj, 'json');
            await fetchDataHtmlH5pYoutube();
          } else {
            //console.log('permission got');
            try {
              const download = RNFS.downloadFile({
                fromUrl: fileUrl,
                toFile: filePath,
                begin: (res) => {
                  console.log('Download started');
                },
                progress: (res) => {},
              });
              const result = await download.promise;
              if (result.statusCode === 200) {
                console.log('File downloaded successfully:', filePath);
                // Define the paths
                const sourcePath = filePath;
                const targetPath = content_file;
                try {
                  // Ensure the target directory exists
                  await RNFS.mkdir(targetPath);
                  // Unzip the file
                  const path = await unzip(sourcePath, targetPath);
                  console.log(`Unzipped to ${path}`);
                  //content unzip in content folder
                  //get content file name
                  let temp_file_url = contentObj?.artifactUrl;
                  const dividedArray = temp_file_url.split('artifact');
                  const file_name =
                    dividedArray[
                      dividedArray.length > 0
                        ? dividedArray.length - 1
                        : dividedArray.length
                    ];
                  // Define the paths
                  const sourcePath_internal = `${content_file}/${content_do_id}${file_name}`;
                  const targetPath_internal = streamingPath;

                  sourcePath_internal.replace('.zip', '');
                  try {
                    // Ensure the target directory exists
                    await RNFS.mkdir(targetPath_internal);
                    // Unzip the file
                    const path = await unzip(
                      sourcePath_internal,
                      targetPath_internal
                    );
                    console.log(`Unzipped to ${path}`);
                    //store content obj
                    //console.log(contentObj);
                    await storeData(content_do_id, contentObj, 'json');
                    setDownloadStatus('completed');
                    setDownloadIcon(download_complete);
                  } catch (error) {
                    console.error(`Error extracting zip file: ${error}`);
                  }
                } catch (error) {
                  console.error(`Error extracting zip file: ${error}`);
                }
              } else {
                Alert.alert('Error', 'Invalid File', [{ text: 'OK' }]);
                setDownloadStatus('download');
                setDownloadIcon(download);
              }
            } catch (error) {
              Alert.alert('Error Catch', `Failed to create file: ${error}`, [
                { text: 'OK' },
              ]);
              console.error('Error creating file:', error);
              setDownloadStatus('download');
              setDownloadIcon(download);
            }
          }
        } catch (err) {
          Alert.alert('Error Catch', `Failed to download file: ${err}`, [
            { text: 'OK' },
          ]);
          console.log('display error', err);
          setDownloadStatus('download');
          setDownloadIcon(download);
        }
      } else {
        Alert.alert('Error', 'Invalid File', [{ text: 'OK' }]);
        setDownloadStatus('download');
        setDownloadIcon(download);
      }
    }
  };

  const downloadContentQuML = async (content_do_id) => {
    const content_file = `${RNFS.DocumentDirectoryPath}/${content_do_id}`;
    const streamingPath = `${content_file}/${content_do_id}.json`;
    //content read
    setDownloadStatus('progress');
    setDownloadIcon(download_inprogress);
    //get data online
    let content_response = await hierarchyContent(content_do_id);
    if (content_response == null) {
      //Alert.alert('Error', 'Internet is not available', [{ text: 'OK' }]);
      setNetworkstatus(false);
      setDownloadStatus('download');
      setDownloadIcon(download);
    } else {
      let contentObj = content_response?.result?.questionSet;
      let filePath = '';
      if (contentObj?.mimeType == 'application/vnd.sunbird.questionset') {
        filePath = `${content_file}`;
      }
      if (filePath != '') {
        //create file and store object in local
        try {
          //console.log('permission got');
          try {
            //create directory
            await RNFS.mkdir(filePath);
            //create directory and add json file in it
            //downlaod here
            let childNodes = contentObj?.childNodes;
            //console.log('childNodes', childNodes);
            let removeNodes = [];
            if (contentObj?.children) {
              for (let i = 0; i < contentObj.children.length; i++) {
                if (contentObj.children[i]?.identifier) {
                  removeNodes.push(contentObj.children[i].identifier);
                }
              }
            }
            //console.log('removeNodes', removeNodes);
            let identifiers = childNodes.filter(
              (item) => !removeNodes.includes(item)
            );
            //console.log('identifiers', identifiers);
            let questions = [];
            const chunks = [];
            let chunkSize = 10;
            for (let i = 0; i < identifiers.length; i += chunkSize) {
              chunks.push(identifiers.slice(i, i + chunkSize));
            }
            //console.log('chunks', chunks);
            for (const chunk of chunks) {
              let response_question = await listQuestion(
                questionListUrl,
                chunk
              );
              if (response_question?.result?.questions) {
                for (
                  let i = 0;
                  i < response_question.result.questions.length;
                  i++
                ) {
                  questions.push(response_question.result.questions[i]);
                }
                //console.log('chunk', chunk);
                //console.log('response_question', response_question);
              }
            }
            //console.log('questions', questions.length);
            //console.log('identifiers', identifiers.length);
            if (questions.length == identifiers.length) {
              let question_result = {
                questions: questions,
                count: questions.length,
              };
              let file_content = { result: question_result };
              await RNFS.writeFile(
                streamingPath,
                JSON.stringify(file_content),
                'utf8'
              );
              console.log('file created successfully:', streamingPath);
              //store content obj
              //console.log(contentObj);
              await storeData(content_do_id, contentObj, 'json');
              setDownloadStatus('completed');
              setDownloadIcon(download_complete);
            } else {
              Alert.alert('Error', 'Invalid File', [{ text: 'OK' }]);
              setDownloadStatus('download');
              setDownloadIcon(download);
            }
            //end download
          } catch (error) {
            Alert.alert('Error Catch', `Failed to create file: ${error}`, [
              { text: 'OK' },
            ]);
            console.error('Error creating file:', error);
            setDownloadStatus('download');
            setDownloadIcon(download);
          }
        } catch (err) {
          Alert.alert('Error Catch', `Failed to create file: ${err}`, [
            { text: 'OK' },
          ]);
          console.log('display error', err);
          setDownloadStatus('download');
          setDownloadIcon(download);
        }
      } else {
        Alert.alert('Error', 'Invalid File', [{ text: 'OK' }]);
        setDownloadStatus('download');
        setDownloadIcon(download);
      }
    }
  };

  const downloadContentPDFEpubVideo = async (content_do_id) => {
    const content_file = `${RNFS.DocumentDirectoryPath}/${content_do_id}`;
    const streamingPath = `${content_file}/${content_do_id}.json`;
    //content read
    setDownloadStatus('progress');
    setDownloadIcon(download_inprogress);
    //get data online
    let content_response = await readContent(content_do_id);
    if (content_response == null) {
      //Alert.alert('Error', 'Internet is not available', [{ text: 'OK' }]);
      setNetworkstatus(false);
      setDownloadStatus('download');
      setDownloadIcon(download);
    } else {
      let contentObj = content_response?.result?.content;
      let filePath = '';
      if (contentObj?.mimeType == 'application/pdf') {
        filePath = `${content_file}.pdf`;
      } else if (contentObj?.mimeType == 'application/epub') {
        filePath = `${content_file}.epub`;
      } else if (contentObj?.mimeType == 'video/mp4') {
        filePath = `${content_file}.mp4`;
      } else if (contentObj?.mimeType == 'video/webm') {
        filePath = `${content_file}.webm`;
      }
      if (filePath != '') {
        //download file and store object in local
        //download file
        // URL of the file to download
        //const fileUrl = contentObj?.artifactUrl;
        const fileUrl = contentObj?.downloadUrl;
        filePath = `${content_file}.zip`;
        //console.log('fileUrl', fileUrl);
        try {
          //console.log('permission got');
          try {
            const download = RNFS.downloadFile({
              fromUrl: fileUrl,
              toFile: filePath,
              begin: (res) => {
                console.log('Download started');
              },
              progress: (res) => {},
            });
            const result = await download.promise;
            if (result.statusCode === 200) {
              console.log('File downloaded successfully:', filePath);
              // Define the paths
              const sourcePath = filePath;
              const targetPath = content_file;
              try {
                // Ensure the target directory exists
                await RNFS.mkdir(targetPath);
                // Unzip the file
                const path = await unzip(sourcePath, targetPath);
                console.log(`Unzipped to ${path}`);
                //store content obj
                //console.log(contentObj);
                await storeData(content_do_id, contentObj, 'json');
                setDownloadStatus('completed');
                setDownloadIcon(download_complete);
              } catch (error) {
                console.log('error', error);
                Alert.alert('Error', 'Invalid File', [{ text: 'OK' }]);
                setDownloadStatus('download');
                setDownloadIcon(download);
              }
            } else {
              Alert.alert(
                'Error Internal',
                `Failed to download file: ${JSON.stringify(result)}`,
                [{ text: 'OK' }]
              );
              console.log('Failed to download file:', result.statusCode);
            }
          } catch (error) {
            Alert.alert('Error Catch', `Failed to create file: ${error}`, [
              { text: 'OK' },
            ]);
            console.error('Error creating file:', error);
            setDownloadStatus('download');
            setDownloadIcon(download);
          }
        } catch (err) {
          Alert.alert('Error Catch', `Failed to create file: ${err}`, [
            { text: 'OK' },
          ]);
          console.log('display error', err);
          setDownloadStatus('download');
          setDownloadIcon(download);
        }
      } else {
        Alert.alert('Error', 'Invalid File', [{ text: 'OK' }]);
        setDownloadStatus('download');
        setDownloadIcon(download);
      }
    }
  };

  return (
    <>
      {validDownloadFile && downloadStatus == 'progress' ? (
        <ActivityIndicator size="large" />
      ) : validDownloadFile && downloadStatus == 'completed' ? (
        <TouchableOpacity>
          <Image
            style={styles.img}
            source={downloadIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      ) : validDownloadFile ? (
        <TouchableOpacity onPress={handleDownload}>
          <Image
            style={styles.img}
            source={downloadIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      ) : (
        <></>
      )}
      <NetworkAlert
        onTryAgain={handleDownload}
        isConnected={networkstatus}
        closeModal={() => {
          setNetworkstatus(!networkstatus);
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  img: {
    width: 30,
    height: 30,
    marginHorizontal: 10,
  },
});

DownloadCard.propTypes = {};

export default DownloadCard;
