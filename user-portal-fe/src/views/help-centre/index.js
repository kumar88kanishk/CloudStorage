
import HelpList from './help-list';
import TitleCard from './TitleCard';

const HelpCenter = () => {

    const list = [
        {
            key: 1,
            title: 'Getting Started',
            summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Diam egestas habitant tristique leo accumsan ac massa nulla. Quis congue euismod vestibulum dui bibendum fames tincidunt. Fringilla volutpat sed platea suspendisse nec id duis. Urna velit adipiscing congue diam lacus, ultricies. Vel diam est volutpat morbi. Habitant vel sed habitasse proin. Tortor arcu vulputate.',
        },
        {
            key: 2,
            title: 'Login Error',
            summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Diam egestas habitant tristique leo accumsan ac massa nulla. Quis congue euismod vestibulum dui bibendum fames tincidunt. Fringilla volutpat sed platea suspendisse nec id duis. Urna velit adipiscing congue diam lacus, ultricies. Vel diam est volutpat morbi. Habitant vel sed habitasse proin. Tortor arcu vulputate.',
        },
        {
            key: 3,
            title: 'Protect Files',
            summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Diam egestas habitant tristique leo accumsan ac massa nulla. Quis congue euismod vestibulum dui bibendum fames tincidunt. Fringilla volutpat sed platea suspendisse nec id duis. Urna velit adipiscing congue diam lacus, ultricies. Vel diam est volutpat morbi. Habitant vel sed habitasse proin. Tortor arcu vulputate.',
        },
        {
            key: 4,
            title: 'Share & permission',
            summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Diam egestas habitant tristique leo accumsan ac massa nulla. Quis congue euismod vestibulum dui bibendum fames tincidunt. Fringilla volutpat sed platea suspendisse nec id duis. Urna velit adipiscing congue diam lacus, ultricies. Vel diam est volutpat morbi. Habitant vel sed habitasse proin. Tortor arcu vulputate.',
        },
        {
            key: 5,
            title: 'Subscription',
            summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Diam egestas habitant tristique leo accumsan ac massa nulla. Quis congue euismod vestibulum dui bibendum fames tincidunt. Fringilla volutpat sed platea suspendisse nec id duis. Urna velit adipiscing congue diam lacus, ultricies. Vel diam est volutpat morbi. Habitant vel sed habitasse proin. Tortor arcu vulputate.',
        }
    ]

    return (<>
        <TitleCard /><br />
        <HelpList helpList={list} />
    </>);
};

export default HelpCenter;
