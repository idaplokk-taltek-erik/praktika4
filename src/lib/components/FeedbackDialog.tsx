import { Alert, Box, Button, Dialog, Spinner } from '@chakra-ui/react';

export function FeedbackDialog({
	isPending,
	error,
	onClose
}: {
	isPending: boolean;
	error: string;
	onClose: () => void;
}) {
	return (
		<Dialog.Root lazyMount open={isPending || !!error} unmountOnExit placement="center">
			<Dialog.Backdrop />
			<Dialog.Positioner>
				<Dialog.Content>
					<Dialog.Body>
						<Box marginTop="8px" textAlign="center">
							{!!error && (
								<Alert.Root status="error">
									<Alert.Indicator />
									<Alert.Title>No countries found: {error}</Alert.Title>
								</Alert.Root>
							)}
							{isPending && (
								<Box margin="32px">
									<Spinner size="xl" />
								</Box>
							)}
						</Box>
					</Dialog.Body>
					{error && (
						<Dialog.Footer>
							<Dialog.ActionTrigger asChild>
								<Button variant="outline" onClick={onClose}>
									X
								</Button>
							</Dialog.ActionTrigger>
						</Dialog.Footer>
					)}
				</Dialog.Content>
			</Dialog.Positioner>
		</Dialog.Root>
	);
}
