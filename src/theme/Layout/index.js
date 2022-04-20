/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import clsx from 'clsx';
import ErrorBoundary from '@docusaurus/ErrorBoundary';
import AnnouncementBar from '@theme/AnnouncementBar';
import Navbar from '@theme/Navbar';
import Footer from '@theme/Footer';
import LayoutProviders from '@theme/LayoutProviders';
import {
	PageMetadata,
	ThemeClassNames,
	useKeyboardNavigation,
} from '@docusaurus/theme-common';
import ErrorPageContent from '@theme/ErrorPageContent';
import './styles.css';
import Head from "@docusaurus/core/lib/client/exports/Head";

export default function Layout(props) {
	const {
		children,
		noFooter,
		wrapperClassName,
		// not really layout-related, but kept for convenience/retro-compatibility
		description,
		rawTitle
	} = props;
	useKeyboardNavigation();
	
	return (
		<LayoutProviders>
			<PageMetadata title={rawTitle} description={description}/>
			
			<Head>
				<link rel="preconnect" href="https://cdn.yeecord.com/" crossOrigin/>
			</Head>
			
			<AnnouncementBar/>
			
			<Navbar/>
			
			<div className={clsx(ThemeClassNames.wrapper.main, wrapperClassName)}>
				<ErrorBoundary fallback={ErrorPageContent}>{children}</ErrorBoundary>
			</div>
			
			{!noFooter && <Footer/>}
		</LayoutProviders>
	);
}
