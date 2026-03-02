import { afterEach, describe, expect, it } from "@jest/globals";
import { act, render, screen } from "@testing-library/react-native";
import React from "react";

import { useAuthStore } from "../../../store/authStore";
import { SignInScreen } from "../screens/SignInScreen";

jest.mock("expo-router", () => {
  const ReactModule = require("react");
  const { Text } = require("react-native");

  return {
    Redirect: ({ href }: { href: string }) =>
      ReactModule.createElement(Text, { testID: "redirect-target" }, href),
  };
});

function setAuthState(
  state: Partial<Pick<ReturnType<typeof useAuthStore.getState>, "accessToken" | "refreshToken" | "hydrated" | "isLoading" | "errorCode">>,
) {
  act(() => {
    useAuthStore.setState(state);
  });
}

function resetAuthState() {
  setAuthState({
    accessToken: null,
    refreshToken: null,
    hydrated: false,
    isLoading: false,
    errorCode: null,
  });
}

describe("SignInScreen smoke", () => {
  afterEach(() => {
    resetAuthState();
  });

  it("SignInScreen_rendersWithoutCrash", () => {
    setAuthState({
      hydrated: true,
      accessToken: null,
      isLoading: false,
      errorCode: null,
    });

    render(<SignInScreen />);

    expect(screen.getByText("Se connecter")).toBeTruthy();
    expect(screen.queryByTestId("redirect-target")).toBeNull();
  });

  it("SignInScreen_displaysLocalizedErrorFromErrorCode", () => {
    setAuthState({
      hydrated: true,
      accessToken: null,
      isLoading: false,
      errorCode: "network",
    });

    render(<SignInScreen />);

    expect(
      screen.getByText("Erreur réseau. Vérifiez votre connexion et réessayez."),
    ).toBeTruthy();
  });
});
