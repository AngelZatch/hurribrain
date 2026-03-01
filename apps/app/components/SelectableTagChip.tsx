import { Tag } from "@/api/tags.api";
import { Pressable } from "react-native";
import TagChip from "./TagChip";

type SelectableTagChipProps = {
  tag: Tag;
  selected: boolean;
  onPress: () => void;
};

export default function SelectableTagChip({
  tag,
  selected,
  onPress,
}: SelectableTagChipProps) {
  return (
    <Pressable onPress={onPress}>
      <TagChip text={tag.name} active={selected} />
    </Pressable>
  );
}
