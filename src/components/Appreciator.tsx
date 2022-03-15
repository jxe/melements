import { Button } from "./Button";
import * as Collapsible from '@radix-ui/react-collapsible';
import { IconButton } from "./IconButton";
import { Cross1Icon, Crosshair2Icon, TriangleUpIcon } from '@radix-ui/react-icons'
import { styled } from "../stitches.config";
import { Sheet, SheetTrigger, SheetContent, SheetClose } from './Sheet'
import { ReactNode, useState } from "react";
import { cloudify, ImageUploadButton } from "./ImageUploadButton";
import { GeolocationAccessory } from "./GeolocationAccessory";
import { EmotionSelect } from "./EmotionSelect";
import { ValueFinder } from "./ValueFinder";
import { Value } from "../types";
import { BoldedList } from "./BoldedList";

const CardHeading = styled("div", {
  textTransform: "uppercase",
  fontSize: "$2",
  fontWeight: "500",
  color: "$gray11",
  padding: "8px",
})

const LocationBubble = styled(Collapsible.Content, {
  backgroundColor: '#fff',
  borderRadius: '10px',
  background: "lightblue",
  margin: "8px",
  padding: "8px",
  boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
  display: 'flex',
  "&[data-state='closed']": {
    display: "none"
  },
  "& > *": {
    flex: 1,
  }
})

const AdaptiveModal = Sheet
const AdaptiveModalTrigger = SheetTrigger
const AdaptiveModalContent = SheetContent
function AdaptiveModalClose() {
  return (
    <SheetClose asChild>
      <IconButton variant="ghost">
        <Cross1Icon />
      </IconButton>
    </SheetClose>
  )

}
const AdaptiveModalHeader = styled('header', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '10px 15px',
  borderBottom: '1px solid #ccc',
})

const ControlGroup = styled('div', {
  display: 'flex',
  gap: "8px",
  alignItems: 'center',
  background: "#eee",
  padding: "8px",
})

interface Appreciation {
  feelings: string[],
  value: Value,
  location?: GeolocationCoordinates,
  imageUrl?: string,
}

const LocatonToggler = styled(IconButton, {
  "&[data-state=open]": {
    backgroundColor: "lightblue"
  }
})

export function Appreciator({ onSave, renderRelatedValues }: {
  onSave: (result: Appreciation) => void
  renderRelatedValues?: (prompt: ReactNode, lifeGets: string[], onPicked: (x: Value) => void) => ReactNode,
}) {
  const [feelings, setFeelings] = useState<string[]>([])
  const [value, setValue] = useState<Value>()
  const [image, setImage] = useState<File>()
  const [location, setLocation] = useState<GeolocationCoordinates>()
  const [isLocationEnabled, setIsLocationEnabled] = useState(false)
  const disabled = !feelings.length || !value
  async function handleClick() {
    const imageUrl = isLocationEnabled && image && await cloudify(image)
    if (!value) return
    onSave({
      feelings,
      value,
      location,
      imageUrl,
    })
  }

  return (
    <AdaptiveModal>
      <AdaptiveModalTrigger asChild>
        <Button>Appreciate</Button>
      </AdaptiveModalTrigger>
      <AdaptiveModalContent side="tallBottom" hideX css={{ display: "flex", flexDirection: "column" }}>
        <AdaptiveModalHeader>
          <AdaptiveModalClose />
          Appreciation
          <Button
            disabled={disabled}
            onClick={handleClick}
          >
            Post
          </Button>
        </AdaptiveModalHeader>
        <div style={{ overflowY: "auto" }}>
          <Collapsible.Root onOpenChange={setIsLocationEnabled}>
            <LocationBubble>
              <GeolocationAccessory onCoordsChange={setLocation} />
              <ImageUploadButton image={image} setImage={setImage} />
            </LocationBubble>
            <ControlGroup>
              <EmotionSelect
                css={{ flex: "auto" }}
                variant='inset'
                feelings={feelings}
                onFeelingsChanged={setFeelings}
              />
              <Collapsible.Trigger asChild>
                <LocatonToggler><Crosshair2Icon /></LocatonToggler>
              </Collapsible.Trigger>
            </ControlGroup>
          </Collapsible.Root>

          {feelings.length > 0 && <CardHeading>
            What's your <BoldedList words={feelings} /> feeling telling you?
          </CardHeading>}

          <ValueFinder
            value={value}
            onValueChanged={setValue}
            renderRelatedValues={renderRelatedValues}
            feelings={feelings}
          />
        </div>
      </AdaptiveModalContent>
    </AdaptiveModal>
  )
}
