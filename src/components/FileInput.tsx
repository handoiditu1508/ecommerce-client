import { preventDefault, stopBubbling } from "@/common/event";
import { loadFileFromUrl } from "@/common/file";
import CONFIG from "@/configs";
import ForwardIcon from "@mui/icons-material/Forward";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Stack, { StackProps } from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import classNames from "classnames";
import React, { useEffect, useRef, useState } from "react";
import { v1 as uuidv1 } from "uuid";

const StyledStack = styled(Stack)(({ theme }) => ({
  minHeight: 100,
  border: theme.vars.shape.smallBorder,
  borderColor: theme.vars.palette.action.active,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1),
  display: "inline-flex",
  position: "relative",
  boxSizing: "border-box",
  "&:not(.disabled):not(.readonly):focus-within": {
    borderColor: theme.vars.palette.primary.main,
  },
  "&.error": {
    borderColor: theme.vars.palette.error.main,
  },
  "&.disabled": {
    borderColor: theme.vars.palette.action.disabled,
    backgroundColor: theme.vars.palette.action.disabledBackground,
    cursor: "not-allowed",
    ".dropzone": {
      color: theme.vars.palette.text.disabled,
      cursor: "not-allowed",
    },
  },
  "&.readonly": {
    borderColor: theme.vars.palette.divider,
    backgroundColor: theme.vars.palette.action.hover,
    ".dropzone": {
      cursor: "default",
      color: theme.vars.palette.text.secondary,
    },
  },
  ".dropzone": {
    cursor: "pointer",
    color: theme.vars.palette.grey[500],
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
    "&>*": {
      pointerEvents: "none",
    },
  },
  ".result-overlay": {
    flexDirection: "column",
  },
  "&.dragover": {
    borderColor: theme.vars.palette.primary.main,
    ".drop-overlay": {
      display: "flex",
    },
  },
  "&.uploaded .result-overlay": {
    display: "flex",
  },
  "&.loading .loading-overlay": {
    display: "flex",
  },
  "&.dragover, &.loading, &.uploaded": {
    ">*:not(.drop-overlay):not(.result-overlay):not(.loading-overlay)": {
      opacity: 0,
    },
  },
}));

type FileInputStatus = "idle" | "dragover" | "loading" | "uploaded";

type OwnProps = {
  /**
   * set `undefined` for uncontrolled input.
   */
  files?: File[];
  inputProps?: Omit<React.ComponentProps<"input">, "type" | "hidden" | "style">;
  dropzonePlaceholder?: string;
  inputPlaceholder?: string;
  error?: string;
  disabled?: boolean;
  readonly?: boolean;
  onFilesChange?: (files: File[], source: "browse" | "drop" | "url" | "clipboard" | "reset") => void;
  onChangeInput?: () => void;
};
export type FileInputProps = OwnProps & Omit<StackProps, keyof OwnProps>;

function FileInput({
  files,
  inputProps,
  dropzonePlaceholder,
  inputPlaceholder,
  error,
  disabled,
  readonly: readOnly,
  onFilesChange = CONFIG.EMPTY_FUNCTION,
  onChangeInput = CONFIG.EMPTY_FUNCTION,
  ...props
}: FileInputProps) {
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
    if (disabled || readOnly) return;
    event.preventDefault();
    dragInnerCounter.current++;
    setStatus("dragover");
  };

  const endDrag: React.DragEventHandler<HTMLDivElement> = (event) => {
    if (disabled || readOnly) return;
    dragInnerCounter.current--;
    if (dragInnerCounter.current === 0) {
      setStatus("idle");
    }
  };

  const dropFile: React.DragEventHandler<HTMLDivElement> = (event) => {
    if (disabled || readOnly) return;
    event.preventDefault();
    setStatus("idle");
    dragInnerCounter.current--;
    if (!files) {
      setFileListToInput(event.dataTransfer.files);
    }
    onFilesChange(Array.from(event.dataTransfer.files), "drop");
    if (inputProps && inputProps.onChange) {
      inputProps.onChange({
        target: hiddenFileInputRef.current,
      } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  const openFileSelectWindow = () => {
    if (disabled || readOnly) return;
    hiddenFileInputRef.current.click();
  };

  const assignRef = (element: HTMLInputElement | null) => {
    if (element) {
      hiddenFileInputRef.current = element;
      if (inputProps && inputProps.ref) {
        if (typeof inputProps.ref === "function") {
          inputProps.ref(element);
        } else {
          inputProps.ref.current = element;
        }
      }
    }
  };

  const reset = (event?: React.FormEvent<HTMLInputElement>) => {
    if (disabled || readOnly) return;
    if (!files) {
      setFileListToInput(CONFIG.EMPTY_ARRAY);
    }
    onFilesChange(CONFIG.EMPTY_ARRAY, "reset");
    if (inputProps && inputProps.onReset) {
      inputProps.onReset(event ?? ({ target: hiddenFileInputRef.current } as unknown as React.FormEvent<HTMLInputElement>));
    }
    if (inputProps && inputProps.onChange) {
      inputProps.onChange({
        target: hiddenFileInputRef.current,
      } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  const uploadFile: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    if (!files) {
      setStatus("uploaded");
    }
    onFilesChange(Array.from(event.currentTarget.files || CONFIG.EMPTY_ARRAY), "browse");
    if (inputProps && inputProps.onChange) {
      inputProps.onChange(event);
    }
  };

  const loadFileFromInputValue = async () => {
    try {
      if (disabled || readOnly) return;
      setStatus("loading");
      const file = await loadFileFromUrl(inputValue, uuidv1());
      const fileArray = [file];
      setStatus("idle");
      if (!files) {
        setFileListToInput(fileArray);
      }
      onFilesChange(fileArray, "url");
      if (inputProps && inputProps.onChange) {
        inputProps.onChange({
          target: hiddenFileInputRef.current,
        } as React.ChangeEvent<HTMLInputElement>);
      }
    } catch (error) {
      setStatus("idle");
      console.error(error);
    }
  };

  const pasteFromClipboard: React.ClipboardEventHandler<HTMLInputElement> = (event) => {
    if (disabled || readOnly) return;
    if (!event.clipboardData.files.length) {
      return;
    }
    if (!files) {
      setFileListToInput(event.clipboardData.files);
    }
    onFilesChange(Array.from(event.clipboardData.files), "clipboard");
    if (inputProps && inputProps.onChange) {
      inputProps.onChange({
        target: hiddenFileInputRef.current,
      } as React.ChangeEvent<HTMLInputElement>);
    }
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
    <StyledStack {...props} className={classNames(status, { error: !!error, disabled, readOnly }, props.className)}>
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
        disabled={disabled}
        slotProps={{
          input: {
            readOnly,
            endAdornment: (<InputAdornment position="end">
              <IconButton
                size="small"
                edge="end"
                disabled={disabled || readOnly}
                onClick={loadFileFromInputValue}>
                <ForwardIcon />
              </IconButton>
            </InputAdornment>),
          },
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
        onDragOver={preventDefault}
        onDragLeave={endDrag}
        onDrop={dropFile}>
        <UploadFileIcon fontSize="large" color="primary" />
      </Box>
      <Box className="result-overlay">
        <Typography variant="subtitle1" noWrap maxWidth="100%">{hiddenFileInputRef.current.files?.item(0)?.name}</Typography>
        <Button size="small" disabled={disabled || readOnly} onClick={() => reset()}>Retry</Button>
      </Box>
      <Box className="loading-overlay">
        <CircularProgress />
      </Box>
      <input
        type="file"
        style={{
          position: "absolute", // for input's `required` native property to work properly
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1,
          opacity: 0, // hide input using hidden will cause unfocusable issue
        }}
        {...inputProps}
        ref={assignRef}
        disabled={disabled || readOnly || inputProps?.disabled}
        onChange={uploadFile}
        onReset={reset}
      />
    </StyledStack>
  );
}

export default FileInput;
