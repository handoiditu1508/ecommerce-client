import { stopBubbling } from "@/common/eventHelpers";
import { loadFileFromUrl } from "@/common/fileHelpers";
import CONFIG from "@/configs";
import ForwardIcon from "@mui/icons-material/Forward";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { Box, Button, CircularProgress, IconButton, InputAdornment, Stack, StackProps, styled, TextField, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { v1 as uuidv1 } from "uuid";

const StyledStack = styled(Stack, { shouldForwardProp: (prop) => !(["status", "error"] as PropertyKey[]).includes(prop) })<{
  status?: FileInputStatus;
  error?: boolean;
}>(({ theme, status, error }) => ({
  minHeight: 100,
  border: theme.shape.largeBorder,
  borderColor: error ? theme.palette.error.main : theme.palette.primary.main,
  borderStyle: "dashed",
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(1),
  display: "inline-flex",
  position: "relative",
  boxSizing: "border-box",
  ...(status === "dragover" && {
    borderStyle: undefined,
  }),
  ".dropzone": {
    cursor: "pointer",
    color: theme.palette.grey[500],
    display: "flex",
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    "&>*": {
      pointerEvents: "none",
    },
    ...theme.typography.subtitle1,
  },
  ".drop-overlay, .result-overlay, .loading-overlay": {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",
    padding: theme.spacing(1),
    boxSizing: "border-box",
    display: "none",
    justifyContent: "center",
    alignItems: "center",
    gap: theme.spacing(1),
  },
  ".drop-overlay": {
    ...(status === "dragover" && {
      display: "flex",
    }),
    "&>*": {
      pointerEvents: "none",
    },
  },
  ".result-overlay": {
    flexDirection: "column",
    ...(status === "uploaded" && {
      display: "flex",
    }),
  },
  ".loading-overlay": {
    ...(status === "loading" && {
      display: "flex",
    }),
  },
  ...(["dragover", "loading", "uploaded"].includes(status!) && {
    ">*:not(.drop-overlay):not(.result-overlay):not(.loading-overlay)": {
      opacity: 0,
    },
  }),
}));

type FileInputStatus = "idle" | "dragover" | "loading" | "uploaded";

type OwnProps = {
  files?: File[];
  inputProps?: Omit<React.ComponentProps<"input">, "type" | "hidden">;
  dropzonePlaceholder?: string;
  inputPlaceholder?: string;
  error?: string;
  onFilesChange?: (files: File[], source: "browse" | "drop" | "url" | "clipboard" | "reset") => void;
  onChangeInput?: () => void;
};
export type FileInputProps = OwnProps & Omit<StackProps, keyof OwnProps>;

function FileInput({ files, inputProps, dropzonePlaceholder, inputPlaceholder, error, onFilesChange = CONFIG.EMPTY_FUNCTION, onChangeInput = CONFIG.EMPTY_FUNCTION, ...props }: FileInputProps) {
  const [status, setStatus] = useState<FileInputStatus>();
  const [inputValue, setInputValue] = useState<string>("");
  const dragInnerCounter = useRef<number>(0);
  const hiddenFileInputRef = useRef<HTMLInputElement>({} as HTMLInputElement);

  useEffect(() => {
    if (files) {
      setFileListToInput(files);
    }
  }, [files]);

  const startDrag: React.DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
    dragInnerCounter.current++;
    setStatus("dragover");
  };

  const endDrag: React.DragEventHandler<HTMLDivElement> = (event) => {
    dragInnerCounter.current--;
    if (dragInnerCounter.current === 0) {
      setStatus("idle");
    }
  };

  const dropFile: React.DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
    setStatus("idle");
    dragInnerCounter.current--;
    if (!files) {
      setFileListToInput(event.dataTransfer.files);
    }
    onFilesChange(Array.from(event.dataTransfer.files), "drop");
  };

  const openFileSelectWindow = () => {
    hiddenFileInputRef.current.click();
  };

  const assignRef = (element: HTMLInputElement | null) => {
    if (element) {
      hiddenFileInputRef.current = element;
      if (inputProps && inputProps.ref) {
        (inputProps.ref as React.MutableRefObject<HTMLInputElement>).current = element;
      }
    }
  };

  const reset = () => {
    if (!files) {
      setFileListToInput(CONFIG.EMPTY_ARRAY);
    }
    onFilesChange(CONFIG.EMPTY_ARRAY, "reset");
  };

  const uploadFile: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    if (!files) {
      setStatus("uploaded");
    }
    onFilesChange(Array.from(event.currentTarget.files || CONFIG.EMPTY_ARRAY), "browse");
  };

  const loadFileFromInputValue = async () => {
    try {
      setStatus("loading");
      const file = await loadFileFromUrl(inputValue, uuidv1());
      const fileArray = [file];
      setStatus("idle");
      if (!files) {
        setFileListToInput(fileArray);
      }
      onFilesChange(fileArray, "url");
    } catch (error) {
      setStatus("idle");
      console.error(error);
    }
  };

  const pasteFromClipboard: React.ClipboardEventHandler<HTMLInputElement> = (event) => {
    if (!files) {
      setFileListToInput(event.clipboardData.files);
    }
    onFilesChange(Array.from(event.clipboardData.files), "clipboard");
  };

  const setFileListToInput = (fileList: FileList | File[]) => {
    // no file found
    if (!fileList.length) {
      hiddenFileInputRef.current.value = "";
      setStatus("idle");

      return;
    }

    // input not multiple => select 1st file
    if (!hiddenFileInputRef.current.attributes.getNamedItem("multiple") && fileList.length > 1) {
      const container = new DataTransfer();
      container.items.add(fileList[0]);
      hiddenFileInputRef.current.files = container.files;
    } else if (Array.isArray(fileList)) {
      const container = new DataTransfer();
      fileList.forEach((file) => {
        container.items.add(file);
      });
      hiddenFileInputRef.current.files = container.files;
    } else {
      hiddenFileInputRef.current.files = fileList;
    }
    setStatus("uploaded");
  };

  const onPressEnter: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
    event.stopPropagation();
    if (event.key === "Enter") {
      loadFileFromInputValue();
    }
  };

  return (
    <StyledStack status={status} error={!!error} {...props}>
      <Box className="dropzone" onClick={openFileSelectWindow} onDragEnter={startDrag}>{dropzonePlaceholder ?? "Drop file here or click to upload"}</Box>
      <TextField
        placeholder={inputPlaceholder ?? "Paste file or file url"}
        type="text"
        variant="standard"
        fullWidth
        size="small"
        value={inputValue}
        error={!!error}
        helperText={error}
        InputProps={{
          endAdornment: (<InputAdornment position="end">
            <IconButton size="small" edge="end" onClick={loadFileFromInputValue}><ForwardIcon /></IconButton>
          </InputAdornment>),
        }}
        onChange={(e) => {
          setInputValue(e.target.value);
          onChangeInput();
        }}
        onClick={stopBubbling}
        onPaste={pasteFromClipboard}
        onKeyDown={onPressEnter}
      />
      <Box
        className="drop-overlay"
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={endDrag}
        onDrop={dropFile}>
        <UploadFileIcon fontSize="large" color="primary" />
      </Box>
      <Box className="result-overlay">
        <Typography variant="subtitle1" noWrap maxWidth="100%">{hiddenFileInputRef.current.files?.item(0)?.name}</Typography>
        <Button size="small" onClick={reset}>Retry</Button>
      </Box>
      <Box className="loading-overlay">
        <CircularProgress />
      </Box>
      <input type="file" hidden onChange={uploadFile} {...inputProps} ref={assignRef} onReset={reset} />
    </StyledStack>
  );
}

export default FileInput;
