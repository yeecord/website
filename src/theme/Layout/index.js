import React from 'react';
import clsx from 'clsx';
import ErrorBoundary from '@docusaurus/ErrorBoundary';
import SkipToContent from '@theme/SkipToContent';
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
		// Not really layout-related, but kept for convenience/retro-compatibility
		rawTitle,
		description,
	} = props;
	useKeyboardNavigation();
	return (
		<LayoutProviders>
			<PageMetadata title={rawTitle} description={description}/>
            
			<SkipToContent/>
			
			<AnnouncementBar/>
			
			<Navbar/>
			
			<div className={clsx(ThemeClassNames.wrapper.main, wrapperClassName)}>
				<ErrorBoundary fallback={ErrorPageContent}>{children}</ErrorBoundary>
			</div>
			
			{!noFooter && <Footer/>}
		</LayoutProviders>
	);
}
