import React from 'react';
import { autoBindMethodsForReact } from 'class-autobind-decorator';
import { Button, ControlGroup, MenuItem } from "@blueprintjs/core";
import { Suggest } from "@blueprintjs/select";
import { ContentTypes, highlightText } from '../utils';

@autoBindMethodsForReact()
class BodySelector extends React.PureComponent {
    constructor(props) {
        super(props);
        this._inputRef = null;
        const selectedContentType = props.contentType || ContentTypes.json;
        this.state = {
            selectedContentType,
            validContentTypes: Object.values(ContentTypes),
            contentTypeHistory: [selectedContentType],
            addingContentType: false
        };
    }

    renderCreateContentTypeOption(
        query: string,
        active: boolean,
        handleClick: React.MouseEventHandler<HTMLElement>,
    ){
        return <MenuItem
                    icon="add"
                    text={`Create "${query}"`}
                    active={active}
                    onClick={handleClick}
                    shouldDismissPopover={false}
                />
    }

    renderContentType(contentType, { handleClick, modifiers, query }) {
        if (!modifiers.matchesPredicate) {
            return null;
        }

        return (
            <MenuItem
                active={modifiers.active}
                disabled={modifiers.disabled}
                key={contentType}
                onClick={handleClick}
                text={highlightText(contentType, query)}
            />
        );
    };

    filterContentType(query, contentType, _index, exactMatch) {
        const normalizedTitle = contentType.toLowerCase();
        const normalizedQuery = query.toLowerCase();

        if (exactMatch) {
            return normalizedTitle === normalizedQuery;
        } else {
            return contentType.indexOf(normalizedQuery) >= 0;
        }
    }; 

    areContentTypesEqual(contentTypeA, contentTypeB) {
        // Compare only the text (ignoring case) just for simplicity.
        return contentTypeA.toLowerCase() === contentTypeB.toLowerCase();
    }

    onSelectContentType(contentType) {
        let {
            contentTypeHistory,
            validContentTypes,
            addingContentType,
            selectedContentType
        } = this.state;

        if(validContentTypes.indexOf(contentType) < 0) {
            validContentTypes.push(contentType);
        }

        const idx = (addingContentType === true)
                    ? contentTypeHistory.indexOf(contentType)
                    : contentTypeHistory.indexOf(selectedContentType);
        if(idx < 0) {
            // Add the contentType in response history
            contentTypeHistory.push(contentType)
        } else {
            contentTypeHistory.splice(idx, 1, contentType);
        }
        this.setState({
            validContentTypes,
            contentTypeHistory,
            selectedContentType: contentType,
            addingContentType: false
        });
    }

    onChangeContentType(e) {
        this.setState({ selectedContentType: e.target.value });
    }

    onDeleteContentType(e) {
        let { selectedContentType, contentTypeHistory } = this.state;
        const idx = contentTypeHistory.indexOf(selectedContentType);
        contentTypeHistory.splice(idx, 1);

        if(contentTypeHistory.length === 0) {
            selectedContentType = '';
            // Alert the parent component when there are no contentTypes left
            // in the response
            if(typeof this.props.onEmptyContentType === 'function')
                this.props.onEmptyContentType();
        } else {
           selectedContentType = contentTypeHistory[0];
        }
        this.setState({
            contentTypeHistory,
            selectedContentType
        });
    }

    onAddContentType() {
        if(this._inputRef) {
            this._inputRef.focus();
        }
        this.setState({ addingContentType: true });
    }

    handleInputRef(ref) {
        this._inputRef = ref;
    }

    getDropdownItems() {
        const {
            selectedContentType,
            validContentTypes,
            contentTypeHistory,
            addingContentType
        } = this.state;

        let items = validContentTypes.filter(
            ct => contentTypeHistory.indexOf(ct) < 0
        );
        return addingContentType === true ? items : [...items, selectedContentType];
    }

    render() {
        const {
            selectedContentType,
            validContentTypes,
            contentTypeHistory,
            addingContentType
        } = this.state;
        return (
            <div className="flex items-center">
                <ControlGroup className="flex-1">
                    <Button icon="plus" text="Add Body" onClick={this.onAddContentType} />
                    <div className="bp3-select flex-shrink">
                        <select
                            value={selectedContentType}
                            onChange={this.onChangeContentType}
                        >
                            <option label="any" value="">any</option>
                            {contentTypeHistory.map((k,i) =>
                                <option value={k} key={i}>{ k }</option>
                            )}
                        </select>
                    </div>
                </ControlGroup>
                <ControlGroup>
                    <Suggest
                        items={this.getDropdownItems()}
                        createNewItemFromQuery={ct => ct}
                        createNewItemRenderer={this.renderCreateContentTypeOption}
                        itemRenderer={this.renderContentType}
                        itemPredicate={this.filterContentType}
                        inputValueRenderer={ct => ct}
                        itemsEqual={this.areContentTypesEqual}
                        onItemSelect={this.onSelectContentType}
                        selectedItem={selectedContentType}
                        inputProps={{inputRef: this.handleInputRef}}
                    />
                    <Button icon="trash" onClick={this.onDeleteContentType} />
                </ControlGroup>
            </div>
        );
    }
}

export default BodySelector;