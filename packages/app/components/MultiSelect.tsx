import { Tag } from "@/api/tags.api";
import { View } from "react-native";
import SelectableTagChip from "./../components/SelectableTagChip";
import { useEffect, useState } from "react";

type MultiSelectProps = {
  items: Array<Tag>;
  selectedItems: Array<Tag>;
  onPress: (updatedItems: Array<Tag>) => void;
};

export default function MultiSelect({
  items,
  selectedItems,
  onPress,
}: MultiSelectProps) {
  const [selected, setSelected] = useState(selectedItems);

  useEffect(() => {
    setSelected(selectedItems);
  }, [selectedItems]);

  const toggleTag = (tag: Tag) => {
    let updatedItems = selected ?? [];
    if (selected?.findIndex((t) => t.uuid === tag.uuid) !== -1) {
      updatedItems = selectedItems.filter((t) => t.uuid !== tag.uuid);
    } else {
      updatedItems.push(tag);
    }
    onPress(updatedItems);
  };

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
      }}
    >
      {items?.map((tag) => (
        <SelectableTagChip
          key={tag.uuid}
          tag={tag}
          selected={selected?.findIndex((t) => t.uuid === tag.uuid) !== -1}
          onPress={() => toggleTag(tag)}
        />
      ))}
    </View>
  );
}
