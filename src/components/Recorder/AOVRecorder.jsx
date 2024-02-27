import React, { createRef, useEffect, useState } from "react";
import useRecorder from "../../hooks/useRecorder";
import { getMediaExtensionByType } from "../../utils/mediaRecorder.utils";
import {
  Checkbox,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  IconButton,
  MenuItem,
  Select,
  Stack,
  Table,
  TableCell,
  TableRow,
  TextField,
  Typography,
  FormControlLabel,
} from "@mui/material";
import moment from "moment";
import { PiRecordFill, PiStopFill } from "react-icons/pi";
import {
  ScreenLockLandscape,
  ScreenShare,
  ScreenShareOutlined,
} from "@mui/icons-material";
import { VideoStream } from "../VideoStream/VideoStream";

const AOVRecorder = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [previewStream, setPreviewStream] = useState();
  const videoRef = createRef(null);

  const {
    start,
    stop,
    remove,
    configureMedia,
    configureStream,
    stream,
    mediaOptions,
    streamOptions,
    recordingTime,
    isRecording,
    blobUrl,
    mediaSuported,
  } = useRecorder();

  useEffect(() => {
    if (blobUrl) {
    }
  }, [blobUrl]);

  useEffect(() => {
    if (stream) {
      setPreviewStream(new MediaStream(stream.getVideoTracks()));
    } else {
      setPreviewStream(null);
    }
  }, [stream]);

  useEffect(() => {
    if (videoRef && videoRef.current) {
    }
  }, [videoRef]);

  const download = (fileName) => {
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = `${fileName || "aov-new-video"}.${getMediaExtensionByType(
      mediaOptions.videoType
    )}`;
    a.click();
    // URL.revokeObjectURL(blobUrl);
  };

  const openInNewTab = () => {
    if (blobUrl) window.open(blobUrl, "_blank");
  };

  const RenderTimer = () => {
    const currentTime = moment("00:00:00", "HH:mm:ss").add(
      recordingTime,
      "seconds"
    );
    return (
      <Typography color="lightgray">
        {currentTime.hours() > 0
          ? currentTime.format("HH:mm:ss")
          : currentTime.format("mm:ss")}
      </Typography>
    );
  };

  const streamOptionToSelectValue = () => {
    if (streamOptions.screenCapture) {
      return "tela";
    } else if (streamOptions.userCam) {
      return "camera";
    } else {
      return "";
    }
  };

  return (
    <>
      <Dialog fullWidth open={isOpen}>
        <DialogContent>
          <Box>
            <VideoStream
              stream={previewStream}
              style={{ backgroundColor: "black" }}
              width={"100%"}
              height={180}
            />

            <Stack spacing={2} padding={2} direction="row">
              <Box width={300}>
                <Stack alignItems="end" spacing={2} direction="row">
                  <Typography minWidth={70} fontSize={11}>
                    Transmitir
                  </Typography>
                  <Select
                    fullWidth
                    variant="standard"
                    onChange={({ target }) => {
                      var { value } = target;
                      configureStream({
                        screenCapture: value === "tela",
                        userCam: value === "camera",
                      });
                    }}
                    size="small"
                    value={streamOptionToSelectValue()}
                  >
                    <MenuItem key={"tela"} value={"tela"}>
                      Tela
                    </MenuItem>
                    <MenuItem key={"camera"} value={"camera"}>
                      Camera
                    </MenuItem>
                  </Select>
                </Stack>

                <Stack
                  marginTop={1}
                  alignItems="end"
                  spacing={2}
                  direction="row"
                >
                  <Typography minWidth={70} fontSize={11}>
                    Formato
                  </Typography>
                  <Select
                    fullWidth
                    variant="standard"
                    onChange={(ev) =>
                      configureMedia({ videoType: ev.target.value })
                    }
                    size="small"
                    value={mediaOptions.videoType}
                  >
                    {mediaSuported.videoTypes.map((videoType) => (
                      <MenuItem key={videoType} value={videoType}>
                        {videoType}
                      </MenuItem>
                    ))}
                  </Select>
                </Stack>

                <Stack
                  marginTop={1}
                  alignItems="end"
                  spacing={2}
                  direction="row"
                >
                  <Typography minWidth={70} fontSize={11}>
                    Video Codec
                  </Typography>
                  <Select
                    fullWidth
                    variant="standard"
                    onChange={(ev) =>
                      configureMedia({ videoCodec: ev.target.value })
                    }
                    size="small"
                    value={mediaOptions.videoCodec}
                  >
                    {mediaSuported.videoCodecs.map((videoCodec) => (
                      <MenuItem key={videoCodec} value={videoCodec}>
                        {videoCodec}
                      </MenuItem>
                    ))}
                  </Select>
                </Stack>

                <Stack
                  marginTop={1}
                  alignItems="end"
                  spacing={2}
                  direction="row"
                >
                  <Typography minWidth={70} fontSize={11}>
                    Audio Codec
                  </Typography>
                  <Select
                    fullWidth
                    variant="standard"
                    onChange={(ev) =>
                      configureMedia({ audioCodec: ev.target.value })
                    }
                    size="small"
                    value={mediaOptions.audioCodec}
                  >
                    {mediaSuported.audioCodecs.map((audioCodec) => (
                      <MenuItem key={audioCodec} value={audioCodec}>
                        {audioCodec}
                      </MenuItem>
                    ))}
                  </Select>
                </Stack>
              </Box>
              <Divider orientation="vertical" flexItem />
              <Box>
                <FormControlLabel
                  checked={streamOptions.screenAudio}
                  onChange={(ev) =>
                    configureStream({ screenAudio: ev.target.value })
                  }
                  control={<Checkbox />}
                  label="Audio do sistema"
                />

                <FormControlLabel
                  checked={streamOptions.micAudio}
                  onChange={(ev) =>
                    configureStream({ micAudio: ev.target.value })
                  }
                  control={<Checkbox />}
                  label="Audio do Mic"
                />
              </Box>
            </Stack>
          </Box>
        </DialogContent>
        <DialogActions>
          {!isRecording && blobUrl ? (
            <>
              <Button size="small" onClick={() => remove()}>
                Descartar
              </Button>
              <Button size="small" onClick={() => openInNewTab()}>
                Visualizar
              </Button>
              <Button size="small" onClick={() => download()}>
                Baixar
              </Button>
            </>
          ) : (
            <>
              <Button size="small" onClick={() => setIsOpen(false)}>
                Fechar
              </Button>
              {isRecording ? (
                <Button
                  onClick={() => stop()}
                  disabled={!stream}
                  size="small"
                  variant="contained"
                  color="error"
                >
                  Parar
                </Button>
              ) : (
                <Button
                  onClick={() => start()}
                  disabled={!stream}
                  size="small"
                  variant="contained"
                  color="error"
                >
                  Iniciar
                </Button>
              )}
            </>
          )}
        </DialogActions>
      </Dialog>

      <Stack
        alignItems="center"
        marginBottom={1}
        paddingRight={1}
        justifyContent="end"
        direction="row"
      >
        {isRecording ? (
          <>
            <RenderTimer />
            <IconButton onClick={() => setIsOpen(true)}>
              <PiStopFill color="red" fontSize={20} />
            </IconButton>
          </>
        ) : (
          <IconButton onClick={() => setIsOpen(true)}>
            <PiRecordFill color="red" fontSize={20} />
          </IconButton>
        )}
      </Stack>
    </>
  );
};

export default AOVRecorder;
