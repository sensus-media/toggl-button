'use strict';
/* global togglbutton, $ */

togglbutton.render(
  '.DivSubTitle:not(.toggl)', { observe: true }, $container => {
    const descriptionSelector = () => {
      const $description = $('.sfDialogTabTable .DivFormWrapper.FormatterTitle');
      return $description.textContent.trim();
    };

    const projectSelector = () => {
      const $project = $('.DivTopBar .spnTopWsName');
      return $project.textContent.trim();
    };

    const tagsSelector = () => {
      return [];
    };

    const link = togglbutton.createTimerLink({
      className: 'stackfield',
      description: descriptionSelector,
      projectName: projectSelector,
      tags: tagsSelector
    });

    $('.DivSubTitle').appendChild(link);
  }
);
