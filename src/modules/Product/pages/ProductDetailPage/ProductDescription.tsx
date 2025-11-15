import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

function ProductDescription() {
  const theme = useTheme();

  return (
    <Box
      component="section"
      sx={{
        mt: 4,
        img: {
          display: "block",
          mx: "auto",
        },
      }}>
      <Typography variant="h5">Description</Typography>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec id dui ac tortor congue mattis. Aliquam in tortor ut velit rhoncus cursus. Phasellus ipsum dolor, viverra ac elementum sed, fringilla eu ex. Suspendisse tempor tristique massa, eget semper nibh venenatis at. Proin hendrerit rutrum lacus, quis vestibulum augue egestas at. Sed rutrum, elit nec interdum pulvinar, ligula lorem interdum urna, in consequat justo ipsum vel ipsum. Nunc venenatis tortor nec est porta, eget luctus justo consequat. Curabitur mattis lacinia sem eu pellentesque. In et erat sit amet enim maximus eleifend. Nullam semper dui sed justo hendrerit porttitor. Phasellus semper euismod lorem, non mollis eros porttitor vitae. Ut vulputate tempor quam, non iaculis diam. Phasellus pretium libero at nisi sodales, sit amet malesuada erat malesuada. Ut vel ex augue.</p>
      <br />
      <Box
        component="img"
        src="https://placehold.co/600x400"
        alt="Product Image"
        sx={{
          maxWidth: theme.breakpoints.values.md,
        }}
      />
      <br />
      <p>Nunc quis lobortis lacus, sed viverra magna. Ut ac orci vestibulum, consequat dui sed, ultricies metus. Praesent rutrum est neque, et accumsan libero commodo sit amet. Aenean scelerisque elementum augue, quis ornare magna vestibulum ac. Curabitur at massa accumsan, vestibulum odio at, gravida nulla. Mauris ut arcu justo. Fusce nisi risus, mattis quis libero molestie, convallis vestibulum augue. In hendrerit vestibulum arcu, euismod faucibus justo placerat et. Donec facilisis lectus vitae ante tincidunt aliquet. Donec eleifend enim non nunc finibus, in bibendum quam semper.</p>
      <br />
      <p>Aenean consectetur commodo urna. Nullam dapibus ultricies lectus, lobortis laoreet tortor bibendum sed. Integer vestibulum malesuada tempor. Sed scelerisque ornare pharetra. Morbi ullamcorper nec mi nec dictum. Quisque luctus eros vitae erat luctus commodo. Praesent aliquet feugiat urna, non volutpat libero varius vel. Nulla facilisi. Cras nec orci non orci interdum placerat vitae id ex. Phasellus eleifend orci ex, sed porttitor eros pretium et. Suspendisse augue sem, euismod eget interdum id, aliquet non urna. Nam at enim tortor. Interdum et malesuada fames ac ante ipsum primis in faucibus.</p>
      <br />
      <Typography variant="h5">Size conversion table</Typography>
      <p>Praesent non hendrerit sapien. Donec arcu dui, consequat a tempor vel, rhoncus sit amet felis. Suspendisse pretium posuere libero in molestie. Aliquam lacinia neque vitae tellus interdum, non mollis sem laoreet. Aliquam luctus orci scelerisque mollis laoreet. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Maecenas in leo molestie, pulvinar risus non, tincidunt nibh. Nam mauris felis, rutrum id interdum eget, iaculis eget nulla. Vestibulum tristique purus et metus eleifend, in venenatis felis accumsan. Nulla id volutpat mauris. Nulla eget bibendum diam. Sed finibus dui tortor, non ultrices arcu pulvinar vel. Etiam rutrum ipsum eget quam porttitor, pretium pharetra ex facilisis. Vivamus ultricies mauris felis, sed posuere massa facilisis sed.</p>
      <br />
      <Box
        component="img"
        src="https://placehold.co/600x400"
        alt="Product Image"
        sx={{
          maxWidth: theme.breakpoints.values.md,
        }}
      />
      <br />
      <p>Proin sed enim a metus dapibus blandit. Pellentesque fringilla non nulla id tristique. Quisque faucibus pulvinar tortor at bibendum. Phasellus in dapibus risus. Proin porttitor elit eget turpis porta viverra. Nulla id libero tellus. Etiam et sapien sed arcu volutpat sollicitudin. Vestibulum dictum nisi eu hendrerit mollis. Morbi pellentesque placerat pulvinar. Donec aliquam neque orci, lobortis porta nisi finibus vitae. Duis malesuada suscipit sodales. Sed hendrerit efficitur lectus ut pharetra. Cras accumsan dui et diam commodo ornare. Phasellus gravida metus in vestibulum volutpat. Nulla eu eleifend eros, vel condimentum mauris. Donec aliquet justo felis, vel pharetra odio congue non.</p>
    </Box>
  );
}

export default ProductDescription;
