import * as React from "react";
import { DropdownMenu } from "radix-ui";
import {
	HamburgerMenuIcon,
	DotFilledIcon,
} from "@radix-ui/react-icons";
import styles from "../css modules/Dropdown.module.css"

const DropdownMenuDemo = () => {
	const [exercise, setExercise] = React.useState("Left Bicep Curl");

	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger asChild>
				<button className={styles.IconButton} aria-label="Customise options">
					<HamburgerMenuIcon />
				</button>
			</DropdownMenu.Trigger>

			<DropdownMenu.Portal>
				<DropdownMenu.Content className={styles.DropdownMenuContent} sideOffset={5}>
					

					<DropdownMenu.Label className={styles.DropdownMenuLabel}>
						Exercises
					</DropdownMenu.Label>
					<DropdownMenu.RadioGroup value={exercise} onValueChange={setExercise}>
						<DropdownMenu.RadioItem
							className={styles.DropdownMenuRadioItem}
							value="Left Bicep Curl"
						>
							<DropdownMenu.ItemIndicator className={styles.DropdownMenuItemIndicator}>
								<DotFilledIcon />
							</DropdownMenu.ItemIndicator>
							Left Bicep Curl
						</DropdownMenu.RadioItem>
						<DropdownMenu.RadioItem
							className={styles.DropdownMenuRadioItem}
							value="Push-Up"
						>
							<DropdownMenu.ItemIndicator className={styles.DropdownMenuItemIndicator}>
								<DotFilledIcon />
							</DropdownMenu.ItemIndicator>
							Push-Up
						</DropdownMenu.RadioItem>
					</DropdownMenu.RadioGroup>

					<DropdownMenu.Arrow className={styles.DropdownMenuArrow} />
				</DropdownMenu.Content>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	);
};

export default DropdownMenuDemo;
