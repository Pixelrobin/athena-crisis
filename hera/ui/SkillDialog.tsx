import {
  getSkillConfig,
  Skill,
  SkillGroup,
} from '@deities/athena/info/Skill.tsx';
import { TileSize } from '@deities/athena/map/Configuration.tsx';
import groupBy from '@deities/hephaestus/groupBy.tsx';
import AudioPlayer from '@deities/ui/AudioPlayer.tsx';
import Breakpoints from '@deities/ui/Breakpoints.tsx';
import { ButtonStyle, SquareButtonStyle } from '@deities/ui/Button.tsx';
import clipBorder from '@deities/ui/clipBorder.tsx';
import useBlockInput from '@deities/ui/controls/useBlockInput.tsx';
import useInput from '@deities/ui/controls/useInput.tsx';
import useMenuNavigation from '@deities/ui/controls/useMenuNavigation.tsx';
import { applyVar } from '@deities/ui/cssVar.tsx';
import Dialog, {
  DialogScrollContainer,
  DialogTab,
  DialogTabBar,
} from '@deities/ui/Dialog.tsx';
import getColor, { BaseColor } from '@deities/ui/getColor.tsx';
import gradient from '@deities/ui/gradient.tsx';
import useScrollIntoView from '@deities/ui/hooks/useScrollIntoView.tsx';
import Icon, { SVGIcon } from '@deities/ui/Icon.tsx';
import Question from '@deities/ui/icons/Question.tsx';
import SkillBorder, {
  SkillBorderIcons,
  SkillIconBorderStyle,
} from '@deities/ui/icons/SkillBorder.tsx';
import Skills from '@deities/ui/icons/Skills.tsx';
import InlineLink from '@deities/ui/InlineLink.tsx';
import Portal from '@deities/ui/Portal.tsx';
import { RainbowStyle, SquarePulseStyle } from '@deities/ui/PulseStyle.tsx';
import Stack from '@deities/ui/Stack.tsx';
import { css, cx } from '@emotion/css';
import Coin from '@iconify-icons/pixelarticons/coin.js';
import { Sprites } from 'athena-crisis:images';
import {
  ReactElement,
  ReactNode,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import getSkillConfigForDisplay from '../lib/getSkillConfigForDisplay.tsx';
import SkillDescription from './SkillDescription.tsx';

const SkillIconInternal = ({
  active,
  background,
  borderStyle,
  button,
  canActivate,
  color,
  disabled,
  icon,
  isFocused,
  onClick,
}: {
  active?: boolean;
  background?: string;
  borderStyle?: SkillIconBorderStyle;
  button?: boolean;
  canActivate?: boolean;
  color?: BaseColor;
  disabled?: boolean;
  icon: SVGIcon;
  isFocused?: boolean;
  onClick?: () => void;
}) => {
  const isInteractive = (button || onClick) && !disabled;
  return (
    <>
      <div
        className={cx(
          containerStyle,
          isInteractive && SquareButtonStyle,
          isInteractive && hoverStyle,
          (active || canActivate) && !disabled && SquarePulseStyle,
          isInteractive && isFocused && 'hover',
          isInteractive && isFocused && SquarePulseStyle,
        )}
        onClick={onClick}
      >
        <Icon
          className={cx(borderIconStyle, active && RainbowStyle)}
          icon={(borderStyle && SkillBorderIcons[borderStyle]) || SkillBorder}
          style={{
            color: disabled
              ? applyVar('text-color-light')
              : color
                ? getColor(color)
                : undefined,
            height: SkillBorder.height,
            width: SkillBorder.width,
          }}
        />
        <div className={skillStyle}>
          {background && (
            <div
              className={backgroundStyle}
              style={{
                background,
              }}
            />
          )}
          <Icon
            className={iconStyle}
            icon={icon}
            style={{
              height: 20,
              width: 20,
            }}
          />
        </div>
      </div>
    </>
  );
};

const containerStyle = css`
  position: relative;
`;

const skillStyle = css`
  align-items: center;
  display: inline-flex;
  height: ${TileSize}px;
  justify-content: center;
  position: relative;
  width: ${TileSize}px;

  color: ${applyVar('text-color')};
  &:hover {
    color: ${applyVar('text-color')};
  }
`;

const borderIconStyle = css`
  color: ${applyVar('border-color')};
  inset: -2px;
  position: absolute;
  z-index: 2;
`;

const hoverStyle = css`
  ${`.${borderIconStyle}`} {
    transition: color 150ms ease;
  }

  &:hover ${`.${borderIconStyle}`} {
    color: ${applyVar('text-color')};
  }
`;

const backgroundStyle = css`
  image-rendering: pixelated;
  inset: 0;
  mask-image: url('${Sprites.Noise}'),
    linear-gradient(
      to bottom right,
      rgba(0, 0, 0, 0.7) 0%,
      rgba(0, 0, 0, 0.7) 50%
    );
  position: absolute;
  z-index: 1;
`;

const iconStyle = css`
  position: relative;
  z-index: 2;
`;

export default function SkillDialog({
  actionName,
  availableSkills,
  blocklistedAreDisabled,
  blocklistedSkills,
  canAction,
  children,
  currentSkill,
  focus,
  onAction,
  onClose,
  onSelect,
  selectedSkills,
  showCost,
  size,
  tabs,
  toggleBlocklist,
  transformOrigin,
}: {
  actionName?: ReactElement;
  availableSkills: ReadonlySet<Skill>;
  blocklistedAreDisabled?: boolean;
  blocklistedSkills?: ReadonlySet<Skill> | null;
  canAction?: (skill: Skill) => boolean;
  children?: ReactNode;
  currentSkill?: Skill | null;
  focus?: boolean;
  onAction?: (skill: Skill) => void;
  onClose: () => void;
  onSelect?: (skill: Skill | null) => void;
  selectedSkills?: ReadonlySet<Skill> | null;
  showCost?: boolean;
  size?: 'small';
  tabs?: ReactNode;
  toggleBlocklist?: boolean;
  transformOrigin?: string;
}) {
  return (
    <Dialog
      onClose={onClose}
      size={size}
      transformOrigin={transformOrigin || 'center center'}
    >
      <SkillContainer
        actionName={actionName}
        availableSkills={availableSkills}
        blocklistedAreDisabled={blocklistedAreDisabled}
        blocklistedSkills={blocklistedSkills}
        canAction={canAction}
        currentSkill={currentSkill}
        focus={focus}
        onAction={onAction}
        onClose={onClose}
        onSelect={onSelect}
        selectedSkills={selectedSkills}
        showCost={showCost}
        toggleBlocklist={toggleBlocklist}
      >
        {children}
      </SkillContainer>
      {tabs && <DialogTabBar>{tabs}</DialogTabBar>}
    </Dialog>
  );
}

export function SkillContainer({
  actionName,
  availableSkills: initialAvailableSkills,
  blocklistedAreDisabled,
  blocklistedSkills: initialBlocklistedSkills,
  canAction,
  children,
  currentSkill,
  focus,
  onAction,
  onClose,
  onSelect,
  selectedSkills,
  showCost,
  toggleBlocklist,
}: {
  actionName?: ReactElement;
  availableSkills: ReadonlySet<Skill>;
  blocklistedAreDisabled?: boolean;
  blocklistedSkills?: ReadonlySet<Skill> | null;
  canAction?: (skill: Skill) => boolean;
  children?: ReactNode;
  currentSkill?: Skill | null;
  focus?: boolean;
  onAction?: (skill: Skill) => void;
  onClose: () => void;
  onSelect?: (skill: Skill | null) => void;
  selectedSkills?: ReadonlySet<Skill> | null;
  showCost?: boolean;
  toggleBlocklist?: boolean;
}) {
  const hasAction = onAction && actionName && currentSkill;
  const [group, setGroup] = useState<SkillGroup | 'all'>('all');
  const [availableSkills, skillGroups] = useMemo(() => {
    const availableSkills =
      group === 'all'
        ? initialAvailableSkills
        : new Set(
            [...initialAvailableSkills].filter(
              (skill) => getSkillConfig(skill).group === group,
            ),
          );
    return [
      availableSkills,
      new Set(
        [...initialAvailableSkills].map((skill) => getSkillConfig(skill).group),
      ),
    ] as const;
  }, [group, initialAvailableSkills]);

  const partition = groupBy(availableSkills, (skill) =>
    selectedSkills?.has(skill)
      ? 'selected'
      : !blocklistedAreDisabled &&
          !toggleBlocklist &&
          initialBlocklistedSkills?.has(skill)
        ? 'disabled'
        : 'enabled',
  );
  const enabledSkills = partition.get('enabled');
  const disabledSkills = partition.get('disabled');

  useBlockInput('dialog');

  const [selected] = useMenuNavigation(
    enabledSkills?.length || 0,
    'dialog',
    true,
  );

  useInput(
    'accept',
    useCallback(
      (event) => {
        if (
          selected === -1 &&
          onAction &&
          currentSkill &&
          (!canAction || canAction(currentSkill))
        ) {
          event.preventDefault();
          onAction(currentSkill);
        }
      },
      [canAction, currentSkill, onAction, selected],
    ),
    'dialog',
  );

  useInput(
    'cancel',
    useCallback(
      (event) => {
        event.preventDefault();

        onClose();
      },
      [onClose],
    ),
    // Has to be on top in order not to interfere with the Map.
    'top',
  );

  const blocklistedSkills = new Set(initialBlocklistedSkills);
  if (blocklistedAreDisabled && initialBlocklistedSkills && currentSkill) {
    blocklistedSkills.delete(currentSkill);
  }

  const key = currentSkill && focus ? `skill-${currentSkill}` : 'skill';
  return (
    <DialogScrollContainer key={key} navigate={false}>
      <Stack gap={16} vertical>
        {focus ? (
          <h2>
            <fbt desc="Headline to view a skill">Skill</fbt>
          </h2>
        ) : (
          <h1>
            {onSelect ? (
              <fbt desc="Headline to choose a skill">Choose a skill</fbt>
            ) : availableSkills.size > 1 ? (
              <fbt desc="Headline to view skills">Skills</fbt>
            ) : (
              <fbt desc="Headline to view a skill">Skill</fbt>
            )}
          </h1>
        )}
        <Stack gap={16} nowrap>
          <InlineLink
            onClick={() => setGroup('all')}
            selectedText={group === 'all'}
          >
            <fbt desc="View all skills">All</fbt>
          </InlineLink>
          {skillGroups.has(SkillGroup.Attack) && (
            <InlineLink
              onClick={() => setGroup(SkillGroup.Attack)}
              selectedText={group === SkillGroup.Attack}
            >
              <fbt desc="Filter by attack-based skills">Attack</fbt>
            </InlineLink>
          )}
          {skillGroups.has(SkillGroup.Defense) && (
            <InlineLink
              onClick={() => setGroup(SkillGroup.Defense)}
              selectedText={group === SkillGroup.Defense}
            >
              <fbt desc="Filter by defense-based skills">Defense</fbt>
            </InlineLink>
          )}
          {skillGroups.has(SkillGroup.Unlock) && (
            <InlineLink
              onClick={() => setGroup(SkillGroup.Unlock)}
              selectedText={group === SkillGroup.Unlock}
            >
              <fbt desc="Filter by unlock-based skills">Unlock</fbt>
            </InlineLink>
          )}
          {skillGroups.has(SkillGroup.Special) && (
            <InlineLink
              onClick={() => setGroup(SkillGroup.Special)}
              selectedText={group === SkillGroup.Special}
            >
              <fbt desc="Filter by special-based skills">Special</fbt>
            </InlineLink>
          )}
          {skillGroups.has(SkillGroup.Invasion) && (
            <InlineLink
              onClick={() => setGroup(SkillGroup.Invasion)}
              selectedText={group === SkillGroup.Invasion}
            >
              <fbt desc="Filter by invasion-based skills">Invasion</fbt>
            </InlineLink>
          )}
          {skillGroups.has(SkillGroup.AI) && (
            <InlineLink
              onClick={() => setGroup(SkillGroup.AI)}
              selectedText={group === SkillGroup.AI}
            >
              <fbt desc="Filter by AI-based skills">AI</fbt>
            </InlineLink>
          )}
        </Stack>
        <Stack gap vertical>
          {enabledSkills?.map((skill, index) => (
            <SkillListItem
              blocklistedSkills={blocklistedSkills}
              currentSkill={!focus ? currentSkill : undefined}
              key={skill}
              onSelect={
                !hasAction || !canAction || canAction(skill)
                  ? onSelect
                  : undefined
              }
              selected={selected === index}
              showCost={showCost}
              skill={skill}
              toggleBlocklist={toggleBlocklist}
            />
          ))}
        </Stack>
        {selectedSkills?.size ? (
          <Stack gap={16} vertical>
            <h2>
              <fbt desc="Headline to for already selected skills">
                Skills selected in other slots
              </fbt>
            </h2>
            <Stack gap vertical>
              {[...selectedSkills].map((skill) => (
                <SkillListItem
                  blocklistedSkills={selectedSkills}
                  currentSkill={currentSkill}
                  key={skill}
                  onSelect={onSelect}
                  showCost={showCost}
                  skill={skill}
                  toggleBlocklist={toggleBlocklist}
                />
              ))}
            </Stack>
          </Stack>
        ) : null}
        {disabledSkills?.length ? (
          <Stack gap={16} vertical>
            <h2>
              <fbt desc="Headline to for disabled skills">Disabled skills</fbt>
            </h2>
            <Stack gap={16} vertical>
              {disabledSkills.map((skill) => (
                <SkillListItem
                  blocklistedSkills={initialBlocklistedSkills}
                  currentSkill={currentSkill}
                  key={skill}
                  onSelect={onSelect}
                  showCost={showCost}
                  skill={skill}
                  toggleBlocklist={toggleBlocklist}
                />
              ))}
            </Stack>
          </Stack>
        ) : null}
        {children}
      </Stack>
    </DialogScrollContainer>
  );
}

const SkillListItem = ({
  blocklistedSkills,
  currentSkill,
  onSelect,
  selected,
  showCost,
  skill,
  toggleBlocklist,
}: {
  blocklistedSkills?: ReadonlySet<Skill> | null;
  currentSkill?: Skill | null;
  onSelect?: (skill: Skill | null) => void;
  selected?: boolean;
  showCost?: boolean;
  skill: Skill;
  toggleBlocklist?: boolean;
}) => {
  const element = useRef<HTMLDivElement>(null);
  const { alpha, borderStyle, colors, icon, name, textColor } =
    getSkillConfigForDisplay(skill);

  useInput(
    'accept',
    useCallback(
      (event) => {
        if (selected && onSelect) {
          event.preventDefault();
          onSelect(currentSkill === skill ? null : skill);
        }
      },
      [selected, currentSkill, onSelect, skill],
    ),
    'dialog',
  );

  useScrollIntoView(element, selected);

  const isBlocked = blocklistedSkills?.has(skill);
  const isInteractive = onSelect && (toggleBlocklist || !isBlocked);
  const background = gradient(colors, alpha);
  const color: BaseColor = Array.isArray(colors) ? colors[0] : colors;

  return (
    <Stack
      className={cx(boxStyle, selected && selectedBoxStyle)}
      gap
      key={skill}
      ref={element}
      vertical
    >
      <Stack
        className={cx(
          itemStyle,
          isInteractive && ButtonStyle,
          isBlocked && blockedStyle,
          selected && 'hover',
        )}
        gap
        onClick={isInteractive ? () => onSelect(skill) : undefined}
        vertical
      >
        <Stack alignCenter gap nowrap>
          <Stack alignCenter gap nowrap start>
            {currentSkill === skill && <div>{'\u00bb'}</div>}
            <SkillIconInternal
              background={background}
              borderStyle={borderStyle}
              color={color}
              icon={icon}
            />
            <div
              className={tagStyle}
              style={{
                background,
                color:
                  alpha != null && alpha >= 0.5 ? textColor : getColor(color),
              }}
            >
              {name}
            </div>
          </Stack>
        </Stack>
        <Stack className={descriptionStyle} gap={16} vertical>
          <SkillDescription color={color} skill={skill} type="regular" />
          <SkillDescription color={color} skill={skill} type="power" />
        </Stack>
      </Stack>
      {showCost && (
        <Stack className={costStyle} gap nowrap start>
          <Icon className={coinIconStyle} icon={Coin} />
          {getSkillConfig(skill).cost}
        </Stack>
      )}
      {currentSkill === skill && onSelect && (
        <div className={descriptionStyle}>
          <InlineLink onClick={() => onSelect(null)}>
            <fbt desc="Remove current skill">Remove this skill</fbt>
          </InlineLink>
        </div>
      )}
    </Stack>
  );
};

export function SkillSelector({
  availableSkills,
  blocklistedAreDisabled: blocklistedAreUnavailable,
  blocklistedSkills,
  currentSkill,
  isFocused,
  onSelect,
  selectedSkills,
  showCost,
  slot,
}: {
  availableSkills: ReadonlySet<Skill>;
  blocklistedAreDisabled?: boolean;
  blocklistedSkills?: ReadonlySet<Skill> | null;
  currentSkill?: Skill | null;
  isFocused?: boolean;
  onSelect: (skill: Skill | null) => void;
  selectedSkills?: ReadonlySet<Skill> | null;
  showCost?: boolean;
  slot?: number;
}) {
  const [showSkillSelector, setShowSkillSelector] = useState(false);

  const onClose = useCallback(() => {
    if (showSkillSelector) {
      AudioPlayer.playSound('UI/Cancel');
      setShowSkillSelector(false);
    }
  }, [showSkillSelector]);

  const onSelectSkill = useCallback(
    (skill: Skill | null) => {
      AudioPlayer.playSound('UI/Accept');
      onSelect(skill);
      onClose();
    },
    [onClose, onSelect],
  );

  const showSelector = useCallback(
    (event: Event) => {
      if (isFocused) {
        event.preventDefault();

        AudioPlayer.playSound('UI/Accept');
        setShowSkillSelector(true);
      }
    },
    [isFocused],
  );
  useInput('accept', showSelector, 'menu');
  useInput('info', showSelector, 'menu');

  const config = currentSkill && getSkillConfigForDisplay(currentSkill);
  const background = (config && gradient(config.colors, config.alpha)) || '';
  const color: BaseColor =
    (config &&
      (Array.isArray(config.colors) ? config.colors[0] : config.colors)) ||
    '';

  return (
    <>
      <SkillIconInternal
        background={background}
        borderStyle="plus"
        color={color}
        icon={Skills}
        isFocused={isFocused}
        key={currentSkill}
        onClick={() => setShowSkillSelector(true)}
        {...config}
      />
      {showSkillSelector && (
        <Portal>
          <SkillDialog
            availableSkills={availableSkills}
            blocklistedAreDisabled={blocklistedAreUnavailable}
            blocklistedSkills={blocklistedSkills}
            currentSkill={currentSkill}
            onClose={onClose}
            onSelect={onSelectSkill}
            selectedSkills={selectedSkills}
            showCost={showCost}
            tabs={
              slot ? (
                <DialogTab highlight>
                  <fbt desc="Skill selector tabs">
                    Slot <fbt:param name="slot">{slot}</fbt:param>
                  </fbt>
                </DialogTab>
              ) : undefined
            }
          />
        </Portal>
      )}
    </>
  );
}

export function SkillIcon({
  active,
  canActivate,
  dialogSize,
  disabled,
  hideDialog,
  showName,
  skill,
}: {
  active?: boolean;
  canActivate?: boolean;
  dialogSize?: 'small';
  disabled?: boolean;
  hideDialog?: boolean;
  showName?: boolean;
  skill: Skill;
}) {
  const [showDialog, setShowDialog] = useState(false);

  const onClose = useCallback(() => {
    if (showDialog) {
      setShowDialog(false);
    }
  }, [showDialog]);

  const { alpha, borderStyle, colors, icon, name, textColor } =
    getSkillConfigForDisplay(skill);
  const background = gradient(colors, alpha);
  const color: BaseColor = Array.isArray(colors) ? colors[0] : colors;

  return (
    <>
      <Stack
        alignCenter
        className={pointerStyle}
        gap
        onClick={!hideDialog ? () => setShowDialog(true) : undefined}
        start
      >
        <SkillIconInternal
          active={active}
          background={background}
          borderStyle={borderStyle}
          button
          canActivate={canActivate}
          color={color}
          disabled={disabled}
          icon={icon}
        />
        {showName && (
          <div
            className={tagStyle}
            style={{
              background,
              color:
                alpha != null && alpha >= 0.5 ? textColor : getColor(color),
            }}
          >
            {name}
          </div>
        )}
      </Stack>
      {showDialog && (
        <Portal>
          <SkillDialog
            availableSkills={new Set([skill])}
            onClose={onClose}
            size={dialogSize}
          />
        </Portal>
      )}
    </>
  );
}

export function HiddenSkillIcon() {
  return (
    <Stack alignCenter className={pointerStyle} gap start>
      <SkillIconInternal icon={Question} />
    </Stack>
  );
}

const tagStyle = css`
  ${clipBorder(2)}
  padding: 3px 6px 5px;
  width: fit-content;
`;

const itemStyle = css`
  cursor: pointer;
  transform-origin: left center;
`;

const boxStyle = css`
  padding: 8px;
  position: relative;
  transition: background-color 150ms ease;

  &:hover {
    ${clipBorder()}
    background-color: ${applyVar('background-color')};
  }
`;

const selectedBoxStyle = css`
  ${clipBorder()}

  background-color: ${applyVar('background-color')};
`;

const blockedStyle = css`
  opacity: 0.7;
  color: ${applyVar('text-color-light')};
`;

const costStyle = css`
  ${clipBorder(4)}

  background: ${applyVar('background-color-light')};
  padding: 8px;
  position: absolute;
  right: 0;
  top: 0;
`;

const pointerStyle = css`
  cursor: pointer;
`;

const coinIconStyle = css`
  margin-top: 1px;
`;

const descriptionStyle = css`
  padding: 0 20px 0 38px;

  ${Breakpoints.lg} {
    padding: 0 40px 0 38px;
  }
`;
